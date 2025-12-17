import { useState } from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { CheckCircle2, XCircle, Award } from "lucide-react-native";
import { Button } from "../ui/Button";
import { Card, CardContent } from "../ui/Card";
import { QuizQuestion } from "../../types";

interface QuizGameProps {
  questions: QuizQuestion[];
  onExit: () => void;
}

export function QuizGame({ questions, onExit }: QuizGameProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [gameFinished, setGameFinished] = useState(false);

  const currentQuestion = questions[currentIndex];

  const handleAnswer = (index: number) => {
    setSelectedOption(index);
    setShowFeedback(true);
    if (index === currentQuestion.answer) {
      setScore(score + 1);
    }
  };

  const nextQuestion = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex(currentIndex + 1);
      setSelectedOption(null);
      setShowFeedback(false);
    } else {
      setGameFinished(true);
    }
  };

  const restartGame = () => {
    setCurrentIndex(0);
    setScore(0);
    setSelectedOption(null);
    setShowFeedback(false);
    setGameFinished(false);
  };

  if (gameFinished) {
    return (
      <View className="items-center justify-center p-6 gap-6 bg-card rounded-2xl border border-border dark:border-white/10">
        <Award size={64} color="#fbbf24" />
        <View className="items-center">
          <Text className="text-2xl font-bold text-foreground">Quiz Completed!</Text>
          <Text className="text-muted-foreground text-base mt-2">
            You scored {score} out of {questions.length}
          </Text>
        </View>
        <View className="flex-row gap-4 w-full">
          <Button variant="outline" onPress={onExit} className="flex-1 border-primary/20">
            <Text className="text-foreground font-medium">Exit</Text>
          </Button>
          <Button onPress={restartGame} className="flex-1 bg-primary">
            <Text className="text-white font-bold">Try Again</Text>
          </Button>
        </View>
      </View>
    );
  }

  return (
    <View className="gap-4">
      {/* Progress Bar */}
      <View className="h-2 bg-muted rounded-full overflow-hidden">
        <View 
          className="h-full bg-primary" 
          style={{ width: `${((currentIndex + 1) / questions.length) * 100}%` }} 
        />
      </View>

      <Text className="text-sm text-muted-foreground font-medium mb-1">
        Question {currentIndex + 1} of {questions.length}
      </Text>

      <Card className="bg-card border border-border dark:border-white/10">
        <CardContent className="p-5">
          <Text className="text-xl font-bold text-foreground leading-7 mb-6">
            {currentQuestion.question}
          </Text>

          <View className="gap-3">
            {currentQuestion.options.map((option, index) => {
              let buttonStyle = "bg-muted/50 border border-transparent";
              let textStyle = "text-foreground";
              let Icon = null;

              if (showFeedback) {
                if (index === currentQuestion.answer) {
                  buttonStyle = "bg-green-100 border-green-500 dark:bg-green-900/40";
                  textStyle = "text-green-700 dark:text-green-400 font-bold";
                  Icon = CheckCircle2;
                } else if (index === selectedOption) {
                  buttonStyle = "bg-red-100 border-red-500 dark:bg-red-900/40";
                  textStyle = "text-red-700 dark:text-red-400 font-bold";
                  Icon = XCircle;
                } else {
                  buttonStyle = "opacity-50 bg-muted";
                }
              } else if (selectedOption === index) {
                buttonStyle = "bg-primary/10 border-primary";
                textStyle = "text-primary font-bold";
              }

              return (
                <TouchableOpacity
                  key={index}
                  disabled={showFeedback}
                  onPress={() => handleAnswer(index)}
                  className={`flex-row items-center p-4 rounded-xl ${buttonStyle}`}
                >
                  <Text className={`flex-1 text-base ${textStyle}`}>{option}</Text>
                  {Icon && <Icon size={20} color={index === currentQuestion.answer ? "#16a34a" : "#dc2626"} />}
                </TouchableOpacity>
              );
            })}
          </View>
        </CardContent>
      </Card>

      {showFeedback && (
        <Button onPress={nextQuestion} size="lg" className="mt-2 bg-primary rounded-xl">
          <Text className="text-white font-bold text-lg">
            {currentIndex < questions.length - 1 ? "Next Question" : "See Results"}
          </Text>
        </Button>
      )}
    </View>
  );
}