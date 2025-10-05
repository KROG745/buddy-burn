import { useState } from 'react';
import { Plus, Trash2, Edit2, Check, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Exercise } from '@/hooks/useExerciseGenerator';

interface ExerciseGuideProps {
  exercises: Exercise[];
  onAddExercise: (exercise: Omit<Exercise, 'id'>) => void;
  onRemoveExercise: (id: string) => void;
  onUpdateExercise: (id: string, updates: Partial<Exercise>) => void;
}

const ExerciseGuide = ({ 
  exercises, 
  onAddExercise, 
  onRemoveExercise,
  onUpdateExercise 
}: ExerciseGuideProps) => {
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [newExercise, setNewExercise] = useState({
    name: '',
    sets: '',
    reps: '',
    duration: '',
    rest: '',
  });
  const [editingExercise, setEditingExercise] = useState<Exercise | null>(null);

  const handleAddExercise = () => {
    if (newExercise.name) {
      onAddExercise(newExercise);
      setNewExercise({ name: '', sets: '', reps: '', duration: '', rest: '' });
      setIsAdding(false);
    }
  };

  const handleStartEdit = (exercise: Exercise) => {
    setEditingId(exercise.id);
    setEditingExercise({ ...exercise });
  };

  const handleSaveEdit = () => {
    if (editingId && editingExercise) {
      onUpdateExercise(editingId, editingExercise);
      setEditingId(null);
      setEditingExercise(null);
    }
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setEditingExercise(null);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-foreground">Exercise Guide</h3>
          <p className="text-sm text-muted-foreground">
            {exercises.length} exercise{exercises.length !== 1 ? 's' : ''} in this workout
          </p>
        </div>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => setIsAdding(!isAdding)}
        >
          <Plus className="w-4 h-4 mr-1" />
          Add Exercise
        </Button>
      </div>

      {/* Add Exercise Form */}
      {isAdding && (
        <Card className="p-4 border-primary/20 bg-primary/5">
          <div className="space-y-3">
            <div>
              <Label htmlFor="new-exercise-name">Exercise Name *</Label>
              <Input
                id="new-exercise-name"
                placeholder="e.g., Push-ups"
                value={newExercise.name}
                onChange={(e) => setNewExercise({ ...newExercise, name: e.target.value })}
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label htmlFor="new-sets">Sets</Label>
                <Input
                  id="new-sets"
                  placeholder="e.g., 3"
                  value={newExercise.sets}
                  onChange={(e) => setNewExercise({ ...newExercise, sets: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="new-reps">Reps</Label>
                <Input
                  id="new-reps"
                  placeholder="e.g., 10-12"
                  value={newExercise.reps}
                  onChange={(e) => setNewExercise({ ...newExercise, reps: e.target.value })}
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label htmlFor="new-duration">Duration</Label>
                <Input
                  id="new-duration"
                  placeholder="e.g., 45s"
                  value={newExercise.duration}
                  onChange={(e) => setNewExercise({ ...newExercise, duration: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="new-rest">Rest</Label>
                <Input
                  id="new-rest"
                  placeholder="e.g., 60s"
                  value={newExercise.rest}
                  onChange={(e) => setNewExercise({ ...newExercise, rest: e.target.value })}
                />
              </div>
            </div>
            <div className="flex gap-2">
              <Button
                type="button"
                size="sm"
                onClick={handleAddExercise}
                disabled={!newExercise.name}
              >
                <Check className="w-4 h-4 mr-1" />
                Add
              </Button>
              <Button
                type="button"
                size="sm"
                variant="outline"
                onClick={() => {
                  setIsAdding(false);
                  setNewExercise({ name: '', sets: '', reps: '', duration: '', rest: '' });
                }}
              >
                <X className="w-4 h-4 mr-1" />
                Cancel
              </Button>
            </div>
          </div>
        </Card>
      )}

      {/* Exercise List */}
      <div className="space-y-2">
        {exercises.map((exercise, index) => (
          <Card key={exercise.id} className="p-4">
            {editingId === exercise.id && editingExercise ? (
              // Edit Mode
              <div className="space-y-3">
                <div>
                  <Label>Exercise Name</Label>
                  <Input
                    value={editingExercise.name}
                    onChange={(e) => setEditingExercise({ ...editingExercise, name: e.target.value })}
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <Label>Sets</Label>
                    <Input
                      value={editingExercise.sets || ''}
                      onChange={(e) => setEditingExercise({ ...editingExercise, sets: e.target.value })}
                    />
                  </div>
                  <div>
                    <Label>Reps</Label>
                    <Input
                      value={editingExercise.reps || ''}
                      onChange={(e) => setEditingExercise({ ...editingExercise, reps: e.target.value })}
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <Label>Duration</Label>
                    <Input
                      value={editingExercise.duration || ''}
                      onChange={(e) => setEditingExercise({ ...editingExercise, duration: e.target.value })}
                    />
                  </div>
                  <div>
                    <Label>Rest</Label>
                    <Input
                      value={editingExercise.rest || ''}
                      onChange={(e) => setEditingExercise({ ...editingExercise, rest: e.target.value })}
                    />
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button type="button" size="sm" onClick={handleSaveEdit}>
                    <Check className="w-4 h-4 mr-1" />
                    Save
                  </Button>
                  <Button type="button" size="sm" variant="outline" onClick={handleCancelEdit}>
                    <X className="w-4 h-4 mr-1" />
                    Cancel
                  </Button>
                </div>
              </div>
            ) : (
              // View Mode
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <Badge variant="secondary" className="text-xs">
                      {index + 1}
                    </Badge>
                    <h4 className="font-medium text-foreground">{exercise.name}</h4>
                  </div>
                  <div className="flex flex-wrap gap-2 text-sm text-muted-foreground">
                    {exercise.sets && <span>Sets: {exercise.sets}</span>}
                    {exercise.reps && <span>• Reps: {exercise.reps}</span>}
                    {exercise.duration && <span>• Duration: {exercise.duration}</span>}
                    {exercise.rest && <span>• Rest: {exercise.rest}</span>}
                  </div>
                </div>
                <div className="flex gap-1 ml-2">
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => handleStartEdit(exercise)}
                  >
                    <Edit2 className="w-4 h-4" />
                  </Button>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => onRemoveExercise(exercise.id)}
                  >
                    <Trash2 className="w-4 h-4 text-destructive" />
                  </Button>
                </div>
              </div>
            )}
          </Card>
        ))}
        
        {exercises.length === 0 && (
          <Card className="p-8 text-center">
            <p className="text-muted-foreground">
              No exercises yet. Add exercises to build your workout guide.
            </p>
          </Card>
        )}
      </div>
    </div>
  );
};

export default ExerciseGuide;
