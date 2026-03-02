"use client";

import { useRef, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Pencil, Trash2, Save, X, ImagePlus, Plus, Crop } from "lucide-react";
import { updateQuestion, deleteQuestion, addQuestion } from "./actions";
import { ImageCropDialog } from "./image-crop-dialog";

interface SubQuestion {
  label: string;
  text: string;
  marks: number | null;
}

interface QuestionData {
  id: string;
  questionNumber: string;
  text: string;
  marks: number | null;
  hasImage: boolean;
  imageUrl: string | null;
  topic: string | null;
  subTopic: string | null;
  answer: string | null;
  subQuestions: SubQuestion[] | null;
}

const BIOLOGY_STRANDS = [
  "Cell Biology and Biodiversity",
  "Anatomy and Physiology of Animals",
  "Anatomy and Physiology of Plants",
];

interface NewQuestionData {
  text: string;
  marks: number | null;
  topic: string | null;
  subTopic: string | null;
  answer: string | null;
  hasImage: boolean;
  imageUrl: string | null;
  subQuestions: SubQuestion[];
}

const emptyNewQuestion: NewQuestionData = {
  text: "",
  marks: null,
  topic: null,
  subTopic: null,
  answer: null,
  hasImage: false,
  imageUrl: null,
  subQuestions: [],
};

export function QuestionList({ questions, paperId }: { questions: QuestionData[]; paperId: string }) {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editData, setEditData] = useState<QuestionData | null>(null);
  const [savingId, setSavingId] = useState<string | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newQ, setNewQ] = useState<NewQuestionData>({ ...emptyNewQuestion });
  const [cropDialogOpen, setCropDialogOpen] = useState(false);
  const [imageToCrop, setImageToCrop] = useState<string | null>(null);
  const [cropContext, setCropContext] = useState<"edit" | "new">("edit");
  const [isPending, startTransition] = useTransition();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const newImageInputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  function startEdit(q: QuestionData) {
    setEditingId(q.id);
    setEditData({
      ...q,
      subQuestions: q.subQuestions ? q.subQuestions.map((s) => ({ ...s })) : null,
    });
  }

  function cancelEdit() {
    setEditingId(null);
    setEditData(null);
  }

  function handleSave() {
    if (!editData) return;
    setSavingId(editData.id);
    startTransition(async () => {
      await updateQuestion({
        id: editData.id,
        text: editData.text,
        marks: editData.marks,
        answer: editData.answer,
        topic: editData.topic,
        subTopic: editData.subTopic,
        hasImage: editData.hasImage,
        imageUrl: editData.imageUrl,
        subQuestions: editData.subQuestions,
      });
      setEditingId(null);
      setEditData(null);
      setSavingId(null);
      router.refresh();
    });
  }

  function handleDelete(id: string) {
    if (!confirm("Delete this question?")) return;
    startTransition(async () => {
      await deleteQuestion(id);
      router.refresh();
    });
  }

  function handleImageReplace(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file || !editData) return;

    const reader = new FileReader();
    reader.onload = () => {
      const dataUri = reader.result as string;
      setEditData({ ...editData, hasImage: true, imageUrl: dataUri });
    };
    reader.readAsDataURL(file);

    // Reset the input so the same file can be re-selected
    e.target.value = "";
  }

  function updateSubQuestion(index: number, field: keyof SubQuestion, value: string | number | null) {
    if (!editData?.subQuestions) return;
    const updated = [...editData.subQuestions];
    updated[index] = { ...updated[index], [field]: value };
    setEditData({ ...editData, subQuestions: updated });
  }

  function handleAddQuestion() {
    if (!newQ.text.trim()) return;
    startTransition(async () => {
      await addQuestion({
        paperId,
        text: newQ.text.trim(),
        marks: newQ.marks,
        answer: newQ.answer,
        topic: newQ.topic,
        subTopic: newQ.subTopic,
        hasImage: newQ.hasImage,
        imageUrl: newQ.imageUrl,
        subQuestions: newQ.subQuestions.length > 0 ? newQ.subQuestions : null,
      });
      setNewQ({ ...emptyNewQuestion });
      setShowAddForm(false);
      router.refresh();
    });
  }

  function handleNewImageUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      setNewQ({ ...newQ, hasImage: true, imageUrl: reader.result as string });
    };
    reader.readAsDataURL(file);
    e.target.value = "";
  }

  function addNewSubQuestion() {
    const nextLabel = String.fromCharCode(97 + newQ.subQuestions.length); // a, b, c...
    setNewQ({
      ...newQ,
      subQuestions: [...newQ.subQuestions, { label: nextLabel, text: "", marks: null }],
    });
  }

  function updateNewSubQuestion(index: number, field: keyof SubQuestion, value: string | number | null) {
    const updated = [...newQ.subQuestions];
    updated[index] = { ...updated[index], [field]: value };
    setNewQ({ ...newQ, subQuestions: updated });
  }

  function removeNewSubQuestion(index: number) {
    const updated = newQ.subQuestions.filter((_, i) => i !== index);
    setNewQ({ ...newQ, subQuestions: updated });
  }

  function openCrop(imageUrl: string, context: "edit" | "new") {
    setImageToCrop(imageUrl);
    setCropContext(context);
    setCropDialogOpen(true);
  }

  function handleCropComplete(croppedDataUri: string) {
    if (cropContext === "edit" && editData) {
      setEditData({ ...editData, hasImage: true, imageUrl: croppedDataUri });
    } else if (cropContext === "new") {
      setNewQ({ ...newQ, hasImage: true, imageUrl: croppedDataUri });
    }
    setCropDialogOpen(false);
    setImageToCrop(null);
  }

  return (
    <div className="space-y-4">
      {/* Add Question button */}
      <div className="flex justify-end">
        <Button
          onClick={() => setShowAddForm(!showAddForm)}
          variant={showAddForm ? "secondary" : "default"}
          size="sm"
        >
          {showAddForm ? (
            <><X className="h-4 w-4 mr-1" /> Cancel</>
          ) : (
            <><Plus className="h-4 w-4 mr-1" /> Add Question</>
          )}
        </Button>
      </div>

      {/* Add Question form */}
      {showAddForm && (
        <Card className="border-primary/30 border-2">
          <CardContent className="pt-6 space-y-4">
            <h3 className="font-semibold text-sm">New Question</h3>

            {/* Question text */}
            <div>
              <label className="text-xs text-muted-foreground">Question Text</label>
              <Textarea
                value={newQ.text}
                onChange={(e) => setNewQ({ ...newQ, text: e.target.value })}
                placeholder="Type or paste the question text here..."
                className="text-sm min-h-[100px] mt-1"
                autoFocus
              />
            </div>

            {/* Marks + Strand */}
            <div className="flex gap-3">
              <div className="w-24">
                <label className="text-xs text-muted-foreground">Marks</label>
                <Input
                  type="number"
                  value={newQ.marks ?? ""}
                  onChange={(e) => setNewQ({ ...newQ, marks: e.target.value ? Number(e.target.value) : null })}
                  className="text-sm mt-1"
                  placeholder="e.g. 2"
                />
              </div>
              <div className="flex-1">
                <label className="text-xs text-muted-foreground">Strand</label>
                <select
                  value={newQ.topic || ""}
                  onChange={(e) => setNewQ({ ...newQ, topic: e.target.value || null })}
                  className="mt-1 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                >
                  <option value="">Select strand...</option>
                  {BIOLOGY_STRANDS.map((s) => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Sub-questions */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-xs text-muted-foreground">Sub-questions (optional)</label>
                <Button type="button" size="sm" variant="outline" onClick={addNewSubQuestion}>
                  <Plus className="h-3 w-3 mr-1" /> Add Sub-question
                </Button>
              </div>
              {newQ.subQuestions.length > 0 && (
                <div className="pl-4 space-y-2 border-l-2 border-muted">
                  {newQ.subQuestions.map((sq, si) => (
                    <div key={si} className="flex items-start gap-2">
                      <span className="text-sm font-medium text-muted-foreground mt-2 shrink-0">({sq.label})</span>
                      <Textarea
                        value={sq.text}
                        onChange={(e) => updateNewSubQuestion(si, "text", e.target.value)}
                        placeholder="Sub-question text..."
                        className="text-sm min-h-[40px] flex-1"
                      />
                      <Input
                        type="number"
                        value={sq.marks ?? ""}
                        onChange={(e) => updateNewSubQuestion(si, "marks", e.target.value ? Number(e.target.value) : null)}
                        className="w-16 text-xs"
                        placeholder="Mks"
                      />
                      <Button type="button" size="sm" variant="ghost" onClick={() => removeNewSubQuestion(si)}>
                        <X className="h-3 w-3" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Diagram */}
            <div>
              <label className="text-xs text-muted-foreground">Diagram (optional)</label>
              {newQ.hasImage && newQ.imageUrl ? (
                <div className="mt-1">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={newQ.imageUrl} alt="Diagram preview" className="max-w-xs rounded border" />
                  <div className="flex gap-2 mt-1.5">
                    <input
                      ref={newImageInputRef}
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={handleNewImageUpload}
                    />
                    <Button type="button" size="sm" variant="outline" onClick={() => newImageInputRef.current?.click()}>
                      <ImagePlus className="h-3.5 w-3.5 mr-1" /> Replace
                    </Button>
                    <Button type="button" size="sm" variant="outline" onClick={() => openCrop(newQ.imageUrl!, "new")}>
                      <Crop className="h-3.5 w-3.5 mr-1" /> Crop
                    </Button>
                    <Button
                      type="button"
                      size="sm"
                      variant="ghost"
                      onClick={() => setNewQ({ ...newQ, hasImage: false, imageUrl: null })}
                    >
                      <Trash2 className="h-3.5 w-3.5 mr-1" /> Remove
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="mt-1">
                  <input
                    ref={newImageInputRef}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleNewImageUpload}
                  />
                  <Button type="button" size="sm" variant="outline" onClick={() => newImageInputRef.current?.click()}>
                    <ImagePlus className="h-3.5 w-3.5 mr-1" /> Add Diagram
                  </Button>
                </div>
              )}
            </div>

            {/* Answer */}
            <div>
              <label className="text-xs text-muted-foreground">Answer / Marking Scheme (optional)</label>
              <Textarea
                value={newQ.answer || ""}
                onChange={(e) => setNewQ({ ...newQ, answer: e.target.value || null })}
                placeholder="Expected answer or marking scheme..."
                className="text-sm min-h-[50px] mt-1"
              />
            </div>

            {/* Save button */}
            <div className="flex justify-end gap-2 pt-2 border-t">
              <Button variant="ghost" onClick={() => { setShowAddForm(false); setNewQ({ ...emptyNewQuestion }); }}>
                Cancel
              </Button>
              <Button onClick={handleAddQuestion} disabled={isPending || !newQ.text.trim()}>
                <Save className="h-4 w-4 mr-1" />
                {isPending ? "Saving..." : "Save Question"}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      <Card>
      <CardContent className="pt-6 space-y-2">
        {questions.map((q) => {
          const isEditing = editingId === q.id;
          const isSaving = savingId === q.id;
          const subs = (isEditing ? editData?.subQuestions : q.subQuestions) || [];
          const currentImageUrl = isEditing ? editData?.imageUrl : q.imageUrl;
          const currentHasImage = isEditing ? editData?.hasImage : q.hasImage;

          return (
            <div key={q.id} className="border rounded-md p-4 space-y-2">
              {/* Top bar: badge + action buttons */}
              <div className="flex items-center justify-between">
                <Badge variant="secondary">Q{q.questionNumber}</Badge>
                <div className="flex gap-1.5">
                  {isEditing ? (
                    <>
                      <Button size="sm" onClick={handleSave} disabled={isPending}>
                        <Save className="h-3.5 w-3.5 mr-1" />
                        {isSaving ? "Saving..." : "Save"}
                      </Button>
                      <Button size="sm" variant="ghost" onClick={cancelEdit} disabled={isPending}>
                        <X className="h-3.5 w-3.5 mr-1" /> Cancel
                      </Button>
                    </>
                  ) : (
                    <>
                      <Button size="sm" variant="outline" onClick={() => startEdit(q)}>
                        <Pencil className="h-3.5 w-3.5 mr-1" /> Edit
                      </Button>
                      <Button size="sm" variant="destructive" onClick={() => handleDelete(q.id)} disabled={isPending}>
                        <Trash2 className="h-3.5 w-3.5" />
                      </Button>
                    </>
                  )}
                </div>
              </div>

              {/* Question text */}
              {isEditing ? (
                <Textarea
                  value={editData?.text || ""}
                  onChange={(e) => setEditData(editData ? { ...editData, text: e.target.value } : null)}
                  className="text-sm min-h-[60px]"
                />
              ) : (
                <p className="text-sm whitespace-pre-wrap">{q.text}</p>
              )}

              {/* Marks */}
              {isEditing ? (
                <div className="flex items-center gap-2">
                  <span className="text-xs text-muted-foreground">Marks:</span>
                  <Input
                    type="number"
                    value={editData?.marks ?? ""}
                    onChange={(e) =>
                      setEditData(editData ? { ...editData, marks: e.target.value ? Number(e.target.value) : null } : null)
                    }
                    className="w-20 text-xs"
                  />
                </div>
              ) : (
                q.marks != null && (
                  <span className="text-xs text-muted-foreground">
                    ({q.marks} mk{q.marks !== 1 ? "s" : ""})
                  </span>
                )
              )}

              {/* Image + replace option */}
              {currentHasImage && currentImageUrl && (
                <div className="mt-2">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={currentImageUrl.startsWith("data:") ? currentImageUrl : encodeURI(currentImageUrl)}
                    alt={`Diagram for Q${q.questionNumber}`}
                    className="max-w-xs rounded border"
                  />
                  {isEditing && (
                    <div className="mt-1.5 flex gap-2">
                      <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={handleImageReplace}
                      />
                      <Button
                        type="button"
                        size="sm"
                        variant="outline"
                        onClick={() => fileInputRef.current?.click()}
                      >
                        <ImagePlus className="h-3.5 w-3.5 mr-1" /> Replace Diagram
                      </Button>
                      <Button
                        type="button"
                        size="sm"
                        variant="outline"
                        onClick={() => openCrop(currentImageUrl!, "edit")}
                      >
                        <Crop className="h-3.5 w-3.5 mr-1" /> Crop
                      </Button>
                    </div>
                  )}
                </div>
              )}

              {/* Add image for questions without one (edit mode only) */}
              {isEditing && !currentHasImage && (
                <div>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleImageReplace}
                  />
                  <Button
                    type="button"
                    size="sm"
                    variant="outline"
                    onClick={() => fileInputRef.current?.click()}
                  >
                    <ImagePlus className="h-3.5 w-3.5 mr-1" /> Add Diagram
                  </Button>
                </div>
              )}

              {/* Topic badges / inputs */}
              {isEditing ? (
                <div className="flex gap-2">
                  <Input
                    value={editData?.topic || ""}
                    onChange={(e) => setEditData(editData ? { ...editData, topic: e.target.value || null } : null)}
                    className="text-xs"
                    placeholder="Topic"
                  />
                  <Input
                    value={editData?.subTopic || ""}
                    onChange={(e) => setEditData(editData ? { ...editData, subTopic: e.target.value || null } : null)}
                    className="text-xs"
                    placeholder="Sub-topic"
                  />
                </div>
              ) : (
                q.topic && (
                  <div className="flex gap-1">
                    <Badge variant="outline" className="text-xs">{q.topic}</Badge>
                    {q.subTopic && <Badge variant="outline" className="text-xs">{q.subTopic}</Badge>}
                  </div>
                )
              )}

              {/* Sub-questions */}
              {subs.length > 0 && (
                <div className="pl-6 space-y-1.5 border-l-2 border-muted mt-2">
                  {subs.map((sq, si) => (
                    <div key={si} className="flex items-start gap-2 text-sm">
                      <span className="font-medium text-muted-foreground shrink-0">({sq.label})</span>
                      {isEditing ? (
                        <div className="flex-1 flex gap-2">
                          <Textarea
                            value={sq.text}
                            onChange={(e) => updateSubQuestion(si, "text", e.target.value)}
                            className="text-sm min-h-[40px] flex-1"
                          />
                          <Input
                            type="number"
                            value={sq.marks ?? ""}
                            onChange={(e) => updateSubQuestion(si, "marks", e.target.value ? Number(e.target.value) : null)}
                            className="w-16 text-xs"
                            placeholder="Mks"
                          />
                        </div>
                      ) : (
                        <>
                          <p className="whitespace-pre-wrap flex-1">{sq.text}</p>
                          {sq.marks != null && (
                            <span className="text-xs text-muted-foreground shrink-0">
                              ({sq.marks} mk{sq.marks !== 1 ? "s" : ""})
                            </span>
                          )}
                        </>
                      )}
                    </div>
                  ))}
                </div>
              )}

              {/* Answer */}
              {isEditing ? (
                <div>
                  <label className="text-xs text-muted-foreground">Answer</label>
                  <Textarea
                    value={editData?.answer || ""}
                    onChange={(e) => setEditData(editData ? { ...editData, answer: e.target.value || null } : null)}
                    className="text-sm min-h-[40px]"
                    placeholder="Answer / marking scheme"
                  />
                </div>
              ) : (
                q.answer && (
                  <details className="mt-2">
                    <summary className="text-xs text-primary cursor-pointer font-medium">
                      Show Answer
                    </summary>
                    <div className="mt-1 p-2 bg-green-50 rounded text-sm whitespace-pre-wrap border border-green-200">
                      {q.answer}
                    </div>
                  </details>
                )
              )}
            </div>
          );
        })}
        </CardContent>
      </Card>

      {imageToCrop && (
        <ImageCropDialog
          open={cropDialogOpen}
          onOpenChange={setCropDialogOpen}
          imageUrl={imageToCrop}
          onCropComplete={handleCropComplete}
        />
      )}
    </div>
  );
}
