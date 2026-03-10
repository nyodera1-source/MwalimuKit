import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type {
  AdjudicationFormData,
  RehearsalPlanFormData,
  PerformanceProgramFormData,
  PortfolioAssessmentFormData,
} from "@/lib/types/creative-arts-forms";

// ─── Adjudication Preview ───

export function AdjudicationVisiblePreview({
  data,
}: {
  data: AdjudicationFormData;
}) {
  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-base">Form Overview</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="grid grid-cols-2 gap-3 text-sm">
          <div>
            <span className="font-semibold text-muted-foreground">
              Category:
            </span>
            <p>{data.category}</p>
          </div>
          <div>
            <span className="font-semibold text-muted-foreground">
              Total Score:
            </span>
            <p>{data.totalPossibleScore} points</p>
          </div>
        </div>
        <div className="text-sm">
          <span className="font-semibold text-muted-foreground">
            Event Context:
          </span>
          <p className="mt-1">{data.eventContext}</p>
        </div>
        <div className="text-sm">
          <span className="font-semibold text-muted-foreground">
            Number of Criteria:
          </span>
          <span className="ml-2">
            {data.judgingCriteria.length} judging criteria
          </span>
        </div>
      </CardContent>
    </Card>
  );
}

export function AdjudicationBlurredPreview({
  data,
}: {
  data: AdjudicationFormData;
}) {
  return (
    <>
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Judging Criteria</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {data.judgingCriteria.map((criterion, idx) => (
              <div key={idx} className="border-b pb-3 last:border-0">
                <p className="font-semibold text-sm">{criterion.criterion}</p>
                <p className="text-xs text-muted-foreground mt-1">
                  {criterion.description}
                </p>
                <div className="flex items-center gap-3 mt-2">
                  <Badge variant="outline">Max: {criterion.maxScore}</Badge>
                  <Badge variant="secondary">
                    Scale: {criterion.ratingScale}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Comment Sections</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {data.commentSections.map((section, idx) => (
              <div key={idx}>
                <p className="text-sm font-semibold">{section.label}</p>
                <p className="text-xs text-muted-foreground">
                  {section.purpose}
                </p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </>
  );
}

// ─── Rehearsal Plan Preview ───

export function RehearsalVisiblePreview({
  data,
}: {
  data: RehearsalPlanFormData;
}) {
  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-base">Rehearsal Overview</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="grid grid-cols-2 gap-3 text-sm">
          <div>
            <span className="font-semibold text-muted-foreground">
              Ensemble:
            </span>
            <p>{data.ensembleType}</p>
          </div>
          <div>
            <span className="font-semibold text-muted-foreground">
              Duration:
            </span>
            <p>{data.duration} minutes</p>
          </div>
        </div>
        <div className="text-sm">
          <span className="font-semibold text-muted-foreground">
            Objectives:
          </span>
          <ul className="mt-1 space-y-1">
            {data.rehearsalObjectives.map((obj, idx) => (
              <li key={idx} className="flex gap-2">
                <span className="text-muted-foreground shrink-0">
                  {idx + 1}.
                </span>
                <span>{obj}</span>
              </li>
            ))}
          </ul>
        </div>
      </CardContent>
    </Card>
  );
}

export function RehearsalBlurredPreview({
  data,
}: {
  data: RehearsalPlanFormData;
}) {
  return (
    <>
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Warm-Up Activities</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {data.warmUpActivities.map((activity, idx) => (
              <div key={idx} className="flex justify-between text-sm">
                <span>{activity.activity}</span>
                <Badge variant="outline">{activity.duration} min</Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Repertoire</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {data.repertoire.map((item, idx) => (
              <div key={idx} className="border-b pb-2 last:border-0">
                <p className="text-sm font-semibold">{item.title}</p>
                {item.composer && (
                  <p className="text-xs text-muted-foreground">
                    {item.composer}
                  </p>
                )}
                <p className="text-xs mt-1">{item.focus}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Section Focus</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {data.sectionFocus.map((section, idx) => (
              <div key={idx}>
                <p className="text-sm font-semibold">{section.section}</p>
                <p className="text-xs text-muted-foreground">
                  {section.goals.join("; ")}
                </p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </>
  );
}

// ─── Performance Program Preview ───

export function ProgramVisiblePreview({
  data,
}: {
  data: PerformanceProgramFormData;
}) {
  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-base">Event Details</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="grid grid-cols-2 gap-3 text-sm">
          <div>
            <span className="font-semibold text-muted-foreground">Event:</span>
            <p>{data.eventName}</p>
          </div>
          <div>
            <span className="font-semibold text-muted-foreground">Venue:</span>
            <p>{data.venue}</p>
          </div>
          <div>
            <span className="font-semibold text-muted-foreground">Date:</span>
            <p>{data.eventDate}</p>
          </div>
          <div>
            <span className="font-semibold text-muted-foreground">Time:</span>
            <p>{data.eventTime}</p>
          </div>
        </div>
        <div className="text-sm">
          <span className="font-semibold text-muted-foreground">
            Program Items:
          </span>
          <span className="ml-2">{data.programItems.length} items</span>
        </div>
      </CardContent>
    </Card>
  );
}

export function ProgramBlurredPreview({
  data,
}: {
  data: PerformanceProgramFormData;
}) {
  return (
    <>
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Program</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {data.programItems.map((item, idx) => (
              <div
                key={idx}
                className="flex items-center gap-3 text-sm border-b pb-2 last:border-0"
              >
                <span className="text-muted-foreground w-6 shrink-0">
                  {item.order}.
                </span>
                <div className="flex-1">
                  <p className="font-medium">{item.title}</p>
                  {item.performerOrGroup && (
                    <p className="text-xs text-muted-foreground">
                      {item.performerOrGroup}
                    </p>
                  )}
                </div>
                <Badge variant="outline">{item.duration} min</Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Acknowledgments</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm">{data.acknowledgments}</p>
        </CardContent>
      </Card>
    </>
  );
}

// ─── Portfolio Assessment Preview ───

export function PortfolioVisiblePreview({
  data,
}: {
  data: PortfolioAssessmentFormData;
}) {
  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-base">Assessment Overview</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="text-sm">
          <span className="font-semibold text-muted-foreground">
            Portfolio Type:
          </span>
          <p className="mt-1">{data.portfolioType}</p>
        </div>
        <div className="grid grid-cols-2 gap-3 text-sm">
          <div>
            <span className="font-semibold text-muted-foreground">
              Total Points:
            </span>
            <p>{data.totalPoints}</p>
          </div>
          <div>
            <span className="font-semibold text-muted-foreground">
              Criteria:
            </span>
            <p>{data.assessmentCriteria.length} areas</p>
          </div>
        </div>
        <div className="text-sm">
          <span className="font-semibold text-muted-foreground">
            Required Components:
          </span>
          <ul className="mt-1 space-y-1">
            {data.requiredComponents.map((comp, idx) => (
              <li key={idx} className="flex gap-2">
                <span className="text-muted-foreground">-</span>
                <span>{comp.component}</span>
              </li>
            ))}
          </ul>
        </div>
      </CardContent>
    </Card>
  );
}

export function PortfolioBlurredPreview({
  data,
}: {
  data: PortfolioAssessmentFormData;
}) {
  return (
    <>
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Assessment Criteria</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {data.assessmentCriteria.map((criterion, idx) => (
              <div key={idx} className="border-b pb-3 last:border-0">
                <p className="font-semibold text-sm">{criterion.criterion}</p>
                <div className="mt-2 space-y-1">
                  {criterion.rubricLevels.map((level, lidx) => (
                    <div key={lidx} className="flex justify-between text-xs">
                      <span>{level.level}</span>
                      <Badge variant="outline" className="text-xs">
                        {level.pointValue} pts
                      </Badge>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Growth Indicators</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-1">
            {data.growthIndicators.map((indicator, idx) => (
              <li key={idx} className="text-sm flex gap-2">
                <span className="text-muted-foreground">-</span>
                <span>{indicator}</span>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Reflection Prompts</CardTitle>
        </CardHeader>
        <CardContent>
          <ol className="space-y-1">
            {data.reflectionPrompts.map((prompt, idx) => (
              <li key={idx} className="text-sm flex gap-2">
                <span className="text-muted-foreground shrink-0">
                  {idx + 1}.
                </span>
                <span>{prompt}</span>
              </li>
            ))}
          </ol>
        </CardContent>
      </Card>
    </>
  );
}
