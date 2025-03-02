import { Card, CardContent } from "./card";

interface ScoreCardProps {
  title: string;
  score: string;
  maxScore?: number;
  description: string;
}

const ScoreCard = ({
  title,
  score,
  maxScore = 100,
  description,
}: ScoreCardProps) => {
  const getStatusColor = (status?: string) => {
    switch (status) {
      case "MEDIUM":
        return "text-amber-600 bg-amber-100";
      case "LOW":
        return "text-emerald-600 bg-emerald-100";
      case "HIGH":
        return "text-red-600 bg-red-100";
      default:
        return "text-gray-600 bg-gray-100";
    }
  };

  const calculateProgress = () => {
    if (!isValidScore) return 0;
    return (scoreValue / maxScore) * 360;
  };

  const isValidScore = !isNaN(parseInt(score));
  const scoreValue = isValidScore ? parseInt(score) : 0;

  return (
    <Card className="p-6 h-full">
      <div className="space-y-1.5">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-medium">{title}</h3>
          {isValidScore && (
            <span
              className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(
                scoreValue <= 40 ? 'LOW' : scoreValue <= 60 ? 'MEDIUM' : 'HIGH'
              )}`}
            >
              {scoreValue <= 40 ? 'LOW' : scoreValue <= 60 ? 'MEDIUM' : 'HIGH'}
            </span>
          )}
        </div>
      </div>
      <CardContent className="pt-6 p-0">
        <div className="flex flex-col items-center text-center space-y-4">
          <div className="relative w-40 h-32">
            <svg className="w-full h-full" viewBox="0 0 100 100">
              <circle
                className="text-gray-100"
                strokeWidth="8"
                stroke="currentColor"
                fill="transparent"
                r="42"
                cx="50"
                cy="50"
              />
              <circle
                className={getStatusColor(
                  scoreValue <= 40? 'LOW' : scoreValue <= 60? 'MEDIUM' : 'HIGH'
                )}
                strokeWidth="8"
                strokeDasharray={264}
                strokeDashoffset={264 - (calculateProgress() / 360) * 264}
                strokeLinecap="round"
                stroke="currentColor"
                fill="transparent"
                r="42"
                cx="50"
                cy="50"
                style={{
                  transform: "rotate(-90deg)",
                  transformOrigin: "50% 50%",
                  transition: "stroke-dashoffset 0.5s",
                }}
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-4xl font-semibold">
                {isValidScore ? scoreValue : "Unavailable"}
              </div>
            </div>
          </div>
          <div className="text-sm text-gray-500">{description}</div>
        </div>
      </CardContent>
    </Card>
  );
};

export { ScoreCard };