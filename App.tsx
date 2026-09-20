import { useState, type ReactNode } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ErrorBoundary } from '@/components/error-boundary';
import { Toaster } from '@/components/ui/toaster';
import { TooltipProvider } from '@/components/ui/tooltip';
import NotFound from '@/pages/not-found';
import InteractiveQuiz, { Question } from '@/components/InteractiveQuiz';
import StudyGroups, { StudyItem } from '@/components/StudyGroups';
import {
  Route,
  Switch,
  useLocation,
  Router as WouterRouter,
} from 'wouter';

const queryClient = new QueryClient();

const sampleQuestions: Question[] = [
  {
    id: 1,
    questionText: "ما هي النواتج الصحيحة لتفاعل المغنيسيوم مع كبريتات النحاس التالي؟ <br/> $$\\text{Mg} + \\text{CuSO}_4 \\rightarrow ?$$",
    options: [
      "$$\\text{MgSO}_4 + \\text{Cu}$$",
      "$$\\text{MgCu} + \\text{SO}_4$$",
      "$$\\text{MgO} + \\text{CuS}$$",
      "لا يحدث تفاعل"
    ],
    correctAnswerIndex: 0,
    explanation: "المغنيسيوم أكثر نشاطاً كيميائياً من النحاس، فيحل محل النحاس في محلول كبريتات النحاس لينتج كبريتات المغنيسيوم وينفصل النحاس."
  },
  {
    id: 2,
    questionText: "ما هو القانون العام لحل المعادلة التربيعية $ax^2 + bx + c = 0$؟",
    options: [
      "$x = \\frac{-b \\pm \\sqrt{b^2 - 4ac}}{2a}$",
      "$x = \\frac{b \\pm \\sqrt{b^2 + 4ac}}{a}$",
      "$x = -b \\pm \\sqrt{b^2 - 4ac}$",
      "$x = \\frac{-b}{2a}$"
    ],
    correctAnswerIndex: 0,
    explanation: "القانون العام للحل هو $x = \\frac{-b \\pm \\sqrt{b^2 - 4ac}}{2a}$ حيث تعبر $b^2 - 4ac$ عن المميز."
  }
];

function Home() {
  const [selectedItem, setSelectedItem] = useState<StudyItem | null>(null);

  return (
    <div className="min-h-screen w-full p-6 bg-slate-100 dir-rtl">
      <div className="max-w-3xl mx-auto space-y-6">
        
        {/* المجموعات الدراسية */}
        <StudyGroups
          onSelectItem={(item) => {
            if (item.type === 'quiz') {
              setSelectedItem(item);
            }
          }}
        />

        {/* عرض الاختبار عند الضغط على عنصر */}
        {selectedItem && (
          <div className="mt-6">
            <div className="flex justify-between items-center mb-3">
              <h3 className="font-bold text-gray-700">جاري عرض: {selectedItem.title}</h3>
              <button
                onClick={() => setSelectedItem(null)}
                className="text-xs text-red-500 hover:underline"
              >
                إغلاق الاختبار ✖
              </button>
            </div>
            <InteractiveQuiz quizTitle={selectedItem.title} questions={sampleQuestions} />
          </div>
        )}

      </div>
    </div>
  );
}

function Router() {
  return (
    <RoutedErrorBoundary>
      <Switch>
        <Route path="/" component={Home} />
        <Route component={NotFound} />
      </Switch>
    </RoutedErrorBoundary>
  );
}

function RoutedErrorBoundary({ children }: { children: ReactNode }) {
  const [location] = useLocation();
  return <ErrorBoundary resetKey={location}>{children}</ErrorBoundary>;
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, '')}>
          <Router />
        </WouterRouter>
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
