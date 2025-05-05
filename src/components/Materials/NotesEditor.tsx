
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface NotesEditorProps {
  materialId: string;
  initialNotes?: string;
  onSave: (id: string, notes: string) => Promise<boolean>;
  className?: string;
}

/**
 * NotesEditor component for adding and editing notes for materials
 */
const NotesEditor: React.FC<NotesEditorProps> = ({ 
  materialId, 
  initialNotes = '', 
  onSave,
  className = '' 
}) => {
  const [notes, setNotes] = useState(initialNotes);
  const [isSaving, setIsSaving] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    // Update local state when initialNotes prop changes
    setNotes(initialNotes);
    setHasChanges(false);
  }, [initialNotes]);

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setNotes(e.target.value);
    setHasChanges(true);
  };

  const handleSave = async () => {
    if (!hasChanges) return;
    
    setIsSaving(true);
    try {
      // Sanitize notes before saving - remove script tags and dangerous attributes
      const sanitizedNotes = notes
        .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
        .replace(/on\w+="[^"]*"/gi, '');
      
      const success = await onSave(materialId, sanitizedNotes);
      if (success) {
        toast({
          title: "Notes saved",
          description: "Your notes have been saved successfully.",
        });
        setHasChanges(false);
      } else {
        toast({
          variant: "destructive",
          title: "Failed to save notes",
          description: "There was a problem saving your notes.",
        });
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "An unexpected error occurred. Please try again.",
      });
      console.error("Error saving notes:", error);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle>Notes</CardTitle>
      </CardHeader>
      <CardContent>
        <Textarea
          value={notes}
          onChange={handleChange}
          className="min-h-[200px] resize-y"
          placeholder="Add your notes here..."
          aria-label="Material notes"
        />
      </CardContent>
      <CardFooter className="flex justify-end">
        <Button 
          onClick={handleSave} 
          disabled={isSaving || !hasChanges}
        >
          {isSaving ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Saving...
            </>
          ) : 'Save Notes'}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default NotesEditor;
