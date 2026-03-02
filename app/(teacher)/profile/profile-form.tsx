"use client";

import { useActionState, useState, useEffect } from "react";
import { updateProfile } from "./actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { KENYAN_COUNTIES } from "@/lib/constants";

interface ProfileFormProps {
  user: {
    fullName: string;
    email: string;
    tscNumber: string | null;
    county: string | null;
    primaryGradeId: string | null;
    primaryAreas: string[];
  };
  grades: { id: string; name: string }[];
  initialLearningAreas: { id: string; name: string }[];
}

export function ProfileForm({ user, grades, initialLearningAreas }: ProfileFormProps) {
  const [state, action, pending] = useActionState(updateProfile, null);
  const [learningAreas, setLearningAreas] = useState(initialLearningAreas);
  const [selectedGradeId, setSelectedGradeId] = useState(user.primaryGradeId || "");
  const [selectedAreas, setSelectedAreas] = useState<string[]>(user.primaryAreas);

  useEffect(() => {
    if (selectedGradeId) {
      fetch(`/api/curriculum/learning-areas?gradeId=${selectedGradeId}`)
        .then((r) => r.json())
        .then(setLearningAreas);
    } else {
      setLearningAreas([]);
    }
  }, [selectedGradeId]);

  const toggleArea = (areaId: string) => {
    setSelectedAreas((prev) =>
      prev.includes(areaId) ? prev.filter((id) => id !== areaId) : [...prev, areaId]
    );
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Personal Information</CardTitle>
      </CardHeader>
      <CardContent>
        <form action={action} className="space-y-4">
          {state?.error && (
            <div className="bg-red-50 text-red-600 text-sm p-3 rounded-md">{state.error}</div>
          )}
          {state?.success && (
            <div className="bg-green-50 text-green-600 text-sm p-3 rounded-md">{state.success}</div>
          )}

          <div className="space-y-2">
            <Label htmlFor="fullName">Full Name</Label>
            <Input id="fullName" name="fullName" defaultValue={user.fullName} required />
          </div>

          <div className="space-y-2">
            <Label>Email</Label>
            <Input value={user.email} disabled className="bg-muted" />
          </div>

          <div className="space-y-2">
            <Label htmlFor="tscNumber">TSC Number (optional)</Label>
            <Input
              id="tscNumber"
              name="tscNumber"
              defaultValue={user.tscNumber || ""}
              placeholder="e.g. TSC/123456"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="county">County</Label>
            <Select name="county" defaultValue={user.county || ""}>
              <SelectTrigger>
                <SelectValue placeholder="Select county" />
              </SelectTrigger>
              <SelectContent>
                {KENYAN_COUNTIES.map((county) => (
                  <SelectItem key={county} value={county}>
                    {county}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="primaryGradeId">Primary Grade You Teach</Label>
            <Select
              name="primaryGradeId"
              defaultValue={user.primaryGradeId || ""}
              onValueChange={setSelectedGradeId}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select grade" />
              </SelectTrigger>
              <SelectContent>
                {grades.map((grade) => (
                  <SelectItem key={grade.id} value={grade.id}>
                    {grade.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {learningAreas.length > 0 && (
            <div className="space-y-2">
              <Label>Learning Areas You Teach</Label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-1">
                {learningAreas.map((area) => (
                  <div key={area.id} className="flex items-center space-x-2">
                    <Checkbox
                      id={area.id}
                      name="primaryAreas"
                      value={area.id}
                      checked={selectedAreas.includes(area.id)}
                      onCheckedChange={() => toggleArea(area.id)}
                    />
                    <Label htmlFor={area.id} className="text-sm font-normal cursor-pointer">
                      {area.name}
                    </Label>
                  </div>
                ))}
              </div>
            </div>
          )}

          <Button type="submit" disabled={pending}>
            {pending ? "Saving..." : "Save Profile"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
