/**
 * Step 4: Goals and Focus Areas
 * Define goals and focus areas for the year
 */

import React, { useState } from 'react';
import { Card } from '../../../components/shadcn/card';
import { Button } from '../../../components/shadcn/button';
import { Input } from '../../../components/shadcn/input';
import { Label } from '../../../components/shadcn/label';
import { Badge } from '../../../components/shadcn/badge';
import { Plus, X } from 'lucide-react';

interface Step4GoalsAndFocusProps {
  goals: string[];
  focusAreas: string[];
  onUpdateGoals: (goals: string[]) => void;
  onUpdateFocusAreas: (areas: string[]) => void;
  onNext: () => void;
  onPrevious: () => void;
}

const FOCUS_AREA_OPTIONS = [
  'Putting',
  'Chipping',
  'Full swing',
  'Driver',
  'Jern',
  'Strategi',
  'Mental',
  'Fysisk',
  'Short game',
  'Course management',
];

export function Step4GoalsAndFocus({
  goals,
  focusAreas,
  onUpdateGoals,
  onUpdateFocusAreas,
  onNext,
  onPrevious,
}: Step4GoalsAndFocusProps) {
  const [newGoal, setNewGoal] = useState('');

  const handleAddGoal = () => {
    if (newGoal.trim()) {
      onUpdateGoals([...goals, newGoal.trim()]);
      setNewGoal('');
    }
  };

  const handleRemoveGoal = (index: number) => {
    onUpdateGoals(goals.filter((_, i) => i !== index));
  };

  const handleToggleFocusArea = (area: string) => {
    if (focusAreas.includes(area)) {
      onUpdateFocusAreas(focusAreas.filter((a) => a !== area));
    } else {
      if (focusAreas.length < 3) {
        onUpdateFocusAreas([...focusAreas, area]);
      }
    }
  };

  const handleNext = () => {
    if (goals.length === 0) {
      alert('Vennligst legg til minst ett mål');
      return;
    }
    onNext();
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="space-y-2">
        <h2 className="text-2xl font-bold text-tier-navy">
          Hva er dine mål for året?
        </h2>
        <p className="text-tier-gray">
          Definer hva du vil oppnå og hvor du vil fokusere
        </p>
      </div>

      <Card className="p-6 space-y-6">
        {/* Goals */}
        <div className="space-y-3">
          <Label className="text-sm font-medium text-tier-navy">Dine mål</Label>

          {/* Existing goals */}
          {goals.length > 0 && (
            <div className="space-y-2">
              {goals.map((goal, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-md"
                >
                  <span className="text-tier-navy">{goal}</span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleRemoveGoal(index)}
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              ))}
            </div>
          )}

          {/* Add new goal */}
          <div className="flex space-x-2">
            <Input
              type="text"
              placeholder="Skriv inn et mål..."
              value={newGoal}
              onChange={(e) => setNewGoal(e.target.value)}
              onKeyPress={(e) => {
                if (e.key === 'Enter') {
                  handleAddGoal();
                }
              }}
              className="flex-1"
            />
            <Button
              onClick={handleAddGoal}
              className="bg-tier-gold hover:bg-tier-gold/90"
            >
              <Plus className="w-4 h-4 mr-1" />
              Legg til
            </Button>
          </div>

          {goals.length === 0 && (
            <p className="text-sm text-tier-gray italic">
              Eksempler: "Senke handicap til 5.0", "Vinne klubbmesterskap", "Forbedre putting 20%"
            </p>
          )}
        </div>

        {/* Focus Areas */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <Label className="text-sm font-medium text-tier-navy">
              Fokusområder (velg opptil 3)
            </Label>
            <span className="text-xs text-tier-gray">
              {focusAreas.length} / 3 valgt
            </span>
          </div>

          <div className="flex flex-wrap gap-2">
            {FOCUS_AREA_OPTIONS.map((area) => {
              const isSelected = focusAreas.includes(area);
              const isDisabled = !isSelected && focusAreas.length >= 3;

              return (
                <Badge
                  key={area}
                  variant={isSelected ? 'default' : 'outline'}
                  className={`cursor-pointer transition-all ${
                    isSelected
                      ? 'bg-tier-navy hover:bg-tier-navy/90'
                      : isDisabled
                      ? 'opacity-50 cursor-not-allowed'
                      : 'hover:bg-gray-100'
                  }`}
                  onClick={() => !isDisabled && handleToggleFocusArea(area)}
                >
                  {area}
                </Badge>
              );
            })}
          </div>
        </div>
      </Card>

      {/* Actions */}
      <div className="flex justify-between">
        <Button variant="outline" onClick={onPrevious}>
          Tilbake
        </Button>
        <Button onClick={handleNext} className="bg-tier-navy hover:bg-tier-navy/90">
          Se forhåndsvisning
        </Button>
      </div>
    </div>
  );
}
