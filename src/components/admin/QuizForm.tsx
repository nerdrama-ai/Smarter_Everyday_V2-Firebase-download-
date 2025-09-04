'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useFieldArray, useForm } from 'react-hook-form';
import * as z from 'zod';
import { useRouter } from 'next/navigation';
import { CalendarIcon, Trash, PlusCircle, Wand2 } from 'lucide-react';
import { format } from 'date-fns';

import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { useToast } from '@/hooks/use-toast';
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover';
import { Calendar } from '../ui/calendar';
import { cn } from '@/lib/utils';
import { Switch } from '../ui/switch';
import type { Quiz } from '@/lib/types';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../ui/select';

const questionSchema = z.object({
  id: z.string(),
  questionText: z.string().min(10, 'Question must be at least 10 characters.'),
  options: z.array(z.string().min(1, 'Option cannot be empty.')).length(4, 'There must be 4 options.'),
  correctAnswer: z.string().min(1, 'Please select a correct answer.'),
  hint: z.string().optional(),
  explanation: z.string().max(200, "Explanation cannot exceed 200 characters.").optional(),
});

const formSchema = z.object({
  quizDate: z.date(),
  topic: z.string().min(3, "Topic must be at least 3 characters."),
  timer: z.number().min(1, 'Timer must be at least 1 minute.'),
  questions: z.array(questionSchema).min(1, 'You must add at least one question.'),
});

type QuizFormValues = z.infer<typeof formSchema>;

interface QuizFormProps {
  quiz?: Quiz;
  onQuizSave: () => void;
}

export function QuizForm({ quiz, onQuizSave }: QuizFormProps) {
  const router = useRouter();
  const { toast } = useToast();

  const defaultValues: Partial<QuizFormValues> = quiz ? {
    quizDate: new Date(`${quiz.date}T00:00:00`),
    topic: quiz.topic,
    timer: quiz.timer,
    questions: quiz.questions,
  } : {
    quizDate: new Date(),
    topic: '',
    timer: 5,
    questions: [],
  };

  const form = useForm<QuizFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues,
    mode: "onChange",
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: 'questions',
  });

  function onSubmit(values: QuizFormValues) {
    // Mock data submission
    console.log('Quiz submitted:', values);
    toast({
      title: 'Quiz Saved!',
      description: `The quiz for ${format(values.quizDate, 'PPP')} has been saved.`,
    });
    onQuizSave();
  }

  const addNewQuestion = () => {
    append({
        id: `new-q-${fields.length + 1}`,
        questionText: '',
        options: ['', '', '', ''],
        correctAnswer: '',
        hint: '',
        explanation: ''
    });
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <FormField
            control={form.control}
            name="quizDate"
            render={({ field }) => (
                <FormItem className="flex flex-col">
                <FormLabel>Quiz Date</FormLabel>
                <Popover>
                    <PopoverTrigger asChild>
                    <FormControl>
                        <Button
                        variant={'outline'}
                        className={cn(
                            'w-full justify-start text-left font-normal',
                            !field.value && 'text-muted-foreground'
                        )}
                        >
                        {field.value ? (
                            format(field.value, 'PPP')
                        ) : (
                            <span>Pick a date</span>
                        )}
                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                        </Button>
                    </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                        mode="single"
                        selected={field.value}
                        onSelect={field.onChange}
                        initialFocus
                    />
                    </PopoverContent>
                </Popover>
                <FormMessage />
                </FormItem>
            )}
            />
             <FormField
                control={form.control}
                name="topic"
                render={({ field }) => (
                    <FormItem>
                    <FormLabel>Quiz Topic</FormLabel>
                     <FormControl>
                        <Input placeholder="e.g., Science & Nature" {...field} />
                    </FormControl>
                    <FormMessage />
                    </FormItem>
                )}
            />
            <FormField
                control={form.control}
                name="timer"
                render={({ field }) => (
                    <FormItem>
                    <FormLabel>Quiz Timer (minutes)</FormLabel>
                    <Select onValueChange={(value) => field.onChange(Number(value))} defaultValue={String(field.value)}>
                        <FormControl>
                        <SelectTrigger>
                            <SelectValue placeholder="Set a timer" />
                        </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                            <SelectItem value="5">5 minutes</SelectItem>
                            <SelectItem value="10">10 minutes</SelectItem>
                            <SelectItem value="15">15 minutes</SelectItem>
                        </SelectContent>
                    </Select>
                    <FormMessage />
                    </FormItem>
                )}
            />
        </div>
        
        <div className="space-y-6">
            <h3 className="text-xl font-headline font-bold">Questions</h3>
            {fields.map((field, index) => (
            <div key={field.id} className="border p-4 rounded-lg space-y-4 relative bg-card/50">
                 <Button type="button" variant="ghost" size="icon" className="absolute top-2 right-2" onClick={() => remove(index)}>
                    <Trash className="h-4 w-4" />
                </Button>
                <FormField
                control={form.control}
                name={`questions.${index}.questionText`}
                render={({ field }) => (
                    <FormItem>
                    <FormLabel>Question {index + 1}</FormLabel>
                    <FormControl>
                        <Textarea placeholder="What is the capital of France?" {...field} />
                    </FormControl>
                    <FormMessage />
                    </FormItem>
                )}
                />
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {Array.from({ length: 4 }).map((_, optionIndex) => (
                        <FormField
                        key={optionIndex}
                        control={form.control}
                        name={`questions.${index}.options.${optionIndex}`}
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Option {optionIndex + 1}</FormLabel>
                            <FormControl>
                                <Input placeholder={`Option ${optionIndex + 1}`} {...field} />
                            </FormControl>
                            <FormMessage />
                            </FormItem>
                        )}
                        />
                    ))}
                </div>
                 <FormField
                    control={form.control}
                    name={`questions.${index}.correctAnswer`}
                    render={({ field: radioField }) => (
                        <FormItem className="space-y-3">
                        <FormLabel>Correct Answer</FormLabel>
                        <FormControl>
                            <RadioGroup
                            onValue-change={radioField.onChange}
                            value={radioField.value}
                            className="flex flex-col space-y-1"
                            >
                            {form.getValues(`questions.${index}.options`).map((option, optionIndex) => (
                                option && (
                                <FormItem key={optionIndex} className="flex items-center space-x-3 space-y-0">
                                    <FormControl>
                                    <RadioGroupItem value={option} />
                                    </FormControl>
                                    <FormLabel className="font-normal">{option}</FormLabel>
                                </FormItem>
                                )
                            ))}
                            </RadioGroup>
                        </FormControl>
                        <FormMessage />
                        </FormItem>
                    )}
                />
                 <FormField
                    control={form.control}
                    name={`questions.${index}.hint`}
                    render={({ field }) => (
                        <FormItem>
                        <FormLabel className="flex items-center gap-2">Hint (Optional)</FormLabel>
                        <FormControl>
                            <Input placeholder="e.g., City of Love" {...field} />
                        </FormControl>
                        <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name={`questions.${index}.explanation`}
                    render={({ field }) => (
                        <FormItem>
                        <FormLabel>Explanation (Optional)</FormLabel>
                        <FormControl>
                           <Textarea placeholder="Explain why the answer is correct (max 200 characters)." {...field} />
                        </FormControl>
                        <FormMessage />
                        </FormItem>
                    )}
                />
            </div>
            ))}
             <Button type="button" variant="outline" onClick={addNewQuestion}>
                <PlusCircle className="mr-2 h-4 w-4" /> Add Question
            </Button>
        </div>
        
        <Button type="submit">Save Quiz</Button>
      </form>
    </Form>
  );
}
