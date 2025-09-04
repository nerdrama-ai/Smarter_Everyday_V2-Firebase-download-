import { QuizComponent } from "@/components/quiz/QuizComponent";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function DashboardPage() {
  return (
    <div className="flex items-center justify-center flex-1">
        <QuizComponent />
    </div>
  );
}
