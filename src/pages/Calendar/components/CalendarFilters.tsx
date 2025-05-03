import React from 'react';
import { Subject } from '@/types';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { CalendarIcon } from 'lucide-react';
import { format } from 'date-fns';

interface CalendarFiltersProps {
  subjects: Subject[];
  selectedSubjectId: string | null;
  setSelectedSubjectId: (id: string | null) => void;
  selectedEventTypes: Record<string, boolean>;
  handleCheckboxChange: (type: string) => void;
  dateRange: {
    from: Date | undefined,
    to: Date | undefined
  };
  setDateRange: React.Dispatch<React.SetStateAction<{
    from: Date | undefined,
    to: Date | undefined
  }>>;
}

const CalendarFilters: React.FC<CalendarFiltersProps> = ({
  subjects,
  selectedSubjectId,
  setSelectedSubjectId,
  selectedEventTypes,
  handleCheckboxChange,
  dateRange,
  setDateRange
}) => {
  return (
    <Card className="mb-6">
      <CardContent className="pt-6">
        <div className="flex flex-col md:flex-row gap-4 items-start md:items-end">
          {/* Subject filter */}
          <div className="w-full md:w-1/3">
            <Label htmlFor="subject-filter">Disciplina</Label>
            <Select
              value={selectedSubjectId || 'none'}
              onValueChange={(value) => setSelectedSubjectId(value === 'none' ? null : value)}
            >
              <SelectTrigger id="subject-filter" className="w-full">
                <SelectValue placeholder="Todas as disciplinas" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">Todas as disciplinas</SelectItem>
                {subjects.map((subject) => (
                  <SelectItem key={subject.id} value={subject.id}>
                    {subject.name} - {subject.grade}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Event type filters */}
          <div className="w-full md:w-1/3 space-y-2">
            <Label>Tipos de Evento</Label>
            <div className="flex space-x-4">
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="exam-filter"
                  checked={selectedEventTypes['exam']}
                  onCheckedChange={() => handleCheckboxChange('exam')}
                />
                <label 
                  htmlFor="exam-filter"
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  Avaliações
                </label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="class-filter"
                  checked={selectedEventTypes['class']}
                  onCheckedChange={() => handleCheckboxChange('class')}
                />
                <label 
                  htmlFor="class-filter"
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  Aulas/Planos
                </label>
              </div>
            </div>
          </div>

          {/* Date range filter */}
          <div className="w-full md:w-1/3">
            <Label className="mb-2 block">Período</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant={"outline"}
                  className="w-full justify-start text-left font-normal"
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {dateRange.from ? (
                    dateRange.to ? (
                      <>
                        {format(dateRange.from, "dd/MM/yyyy")} -{" "}
                        {format(dateRange.to, "dd/MM/yyyy")}
                      </>
                    ) : (
                      format(dateRange.from, "dd/MM/yyyy")
                    )
                  ) : (
                    <span>Selecione o período</span>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  initialFocus
                  mode="range"
                  defaultMonth={new Date()}
                  selected={{ from: dateRange.from, to: dateRange.to }}
                  onSelect={(range) => setDateRange({
                    from: range?.from,
                    to: range?.to
                  })}
                  numberOfMonths={2}
                />
              </PopoverContent>
            </Popover>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default CalendarFilters;
