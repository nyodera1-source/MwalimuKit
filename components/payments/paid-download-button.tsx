"use client";

import { useEffect, useState } from "react";
import { CheckCircle, Download, Loader2, Smartphone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

type PaidProduct = "lesson_plan" | "scheme_of_work";

const PRODUCT_LABELS: Record<PaidProduct, { name: string; price: number }> = {
  lesson_plan: { name: "lesson plan", price: 10 },
  scheme_of_work: { name: "scheme of work", price: 20 },
};

export function PaidDownloadButton({
  product,
  documentId,
  size = "default",
  className,
}: {
  product: PaidProduct;
  documentId: string;
  size?: "default" | "sm" | "lg";
  className?: string;
}) {
  const [open, setOpen] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState("");
  const [paymentId, setPaymentId] = useState<string | null>(null);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const [mpesaEnabled, setMpesaEnabled] = useState<boolean | null>(null);
  const details = PRODUCT_LABELS[product];
  const downloadUrl = product === "lesson_plan"
    ? `/api/lesson-plans/${documentId}/export?format=pdf`
    : `/api/schemes/${documentId}/export`;

  useEffect(() => {
    let active = true;
    fetch("/api/payments/mpesa/status", { cache: "no-store" })
      .then((response) => response.json() as Promise<{ enabled?: boolean }>)
      .then((data) => {
        if (active) setMpesaEnabled(data.enabled !== false);
      })
      .catch(() => {
        // Fail closed if the feature flag cannot be read.
        if (active) setMpesaEnabled(false);
      });
    return () => {
      active = false;
    };
  }, []);

  function reset() {
    setPhoneNumber("");
    setPaymentId(null);
    setMessage("");
    setError("");
    setBusy(false);
  }

  async function waitForPayment(id: string) {
    for (let attempt = 0; attempt < 40; attempt += 1) {
      await new Promise((resolve) => setTimeout(resolve, 3000));
      const reconcile = attempt === 39 ? "&reconcile=1" : "";
      const response = await fetch(`/api/payments/mpesa/status?paymentId=${id}${reconcile}`, {
        cache: "no-store",
      });
      const data = (await response.json()) as {
        status?: string;
        message?: string;
        downloadUrl?: string;
      };

      if (data.status === "completed" && data.downloadUrl) {
        window.location.assign(data.downloadUrl);
        return;
      }
      if (data.status === "failed" || data.status === "cancelled") {
        throw new Error(data.message || "The M-PESA payment was not completed.");
      }
    }

    throw new Error("We are still waiting for M-PESA confirmation. Please try again shortly.");
  }

  async function startPayment() {
    setBusy(true);
    setError("");
    setMessage("");

    try {
      const response = await fetch("/api/payments/mpesa/initiate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ product, documentId, phoneNumber }),
      });
      const data = (await response.json()) as {
        error?: string;
        status?: string;
        paymentId?: string;
        downloadUrl?: string;
        message?: string;
      };

      if (!response.ok) throw new Error(data.error || "Could not start the payment.");
      if (data.status === "completed" && data.downloadUrl) {
        window.location.assign(data.downloadUrl);
        return;
      }
      if (!data.paymentId) throw new Error("M-PESA did not return a payment reference.");

      setPaymentId(data.paymentId);
      setMessage(data.message || "Check your phone and enter your M-PESA PIN.");
      await waitForPayment(data.paymentId);
    } catch (paymentError) {
      setError(paymentError instanceof Error ? paymentError.message : "Payment could not be completed.");
    } finally {
      setBusy(false);
    }
  }

  function handleDownloadClick() {
    if (mpesaEnabled === false) {
      window.location.assign(downloadUrl);
      return;
    }
    setOpen(true);
  }

  return (
    <>
      <Button size={size} className={className} onClick={handleDownloadClick} disabled={mpesaEnabled === null}>
        <Download className="h-4 w-4" />
        {mpesaEnabled === false ? "Download PDF" : `Download PDF - KES ${details.price}`}
      </Button>

      <Dialog open={open} onOpenChange={(nextOpen) => { setOpen(nextOpen); if (!nextOpen) reset(); }}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Pay to download your {details.name}</DialogTitle>
            <DialogDescription>
              You will pay KES {details.price} through M-PESA. Once confirmed, this document can be downloaded again without another charge.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-3">
            <label htmlFor={`mpesa-phone-${documentId}`} className="text-sm font-medium">
              M-PESA phone number
            </label>
            <div className="relative">
              <Smartphone className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                id={`mpesa-phone-${documentId}`}
                value={phoneNumber}
                onChange={(event) => setPhoneNumber(event.target.value)}
                placeholder="0712 345 678"
                inputMode="tel"
                className="pl-9"
                disabled={busy}
              />
            </div>
            {message && !error && (
              <p className="flex items-center gap-2 text-sm text-blue-700">
                {paymentId && <Loader2 className="h-4 w-4 animate-spin" />}
                {message}
              </p>
            )}
            {error && <p className="text-sm text-red-600">{error}</p>}
            {paymentId && !error && !busy && (
              <p className="flex items-center gap-2 text-sm text-green-700">
                <CheckCircle className="h-4 w-4" /> Payment confirmed.
              </p>
            )}
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setOpen(false)} disabled={busy}>
              Cancel
            </Button>
            <Button type="button" onClick={startPayment} disabled={busy || !phoneNumber.trim()}>
              {busy && <Loader2 className="h-4 w-4 animate-spin" />}
              {busy ? "Waiting for payment..." : `Pay KES ${details.price}`}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
