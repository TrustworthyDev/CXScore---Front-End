import { useEffect, useState } from "react";
import { useViolationNote } from "../../../lib/violations/notes";
import { SmallSpinner } from "../../atoms/loading";
import { Button } from "../../atoms/button";
import clsx from "clsx";

export const ViolationNoteEdit = (props: { violationId: string }) => {
  const {
    postNote,
    isPostNoteLoading,
    isPostNoteError,
    note,
    isNoteLoading,
    isNoteFetching,
  } = useViolationNote({
    violationId: props.violationId,
  });

  const [noteInput, setNoteInput] = useState<string>(note ? note : "");

  useEffect(() => {
    if (!isNoteLoading) {
      setNoteInput(note);
    }
  }, [note]);

  const handleSave = () => {
    if (noteInput === note) return;
    postNote(noteInput.trim());
  };

  const saveDisabled =
    isPostNoteLoading || isNoteLoading || isNoteFetching || noteInput === note;

  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2 font-semibold">
        <div className="text-md font-display uppercase">Notes</div>
      </div>
      {isNoteLoading ? (
        <SmallSpinner />
      ) : (
        <div className="space-y-2">
          {isPostNoteError && !isPostNoteLoading && (
            <div className="text-red-500">
              Something went wrong while saving the note. Please try again.
            </div>
          )}
          <textarea
            className="h-[150px] w-full border border-gray-300 p-2"
            disabled={isPostNoteLoading}
            value={noteInput}
            onChange={(e) => setNoteInput(e.target.value)}
            onBlur={handleSave}
          />
          <Button
            loading={isPostNoteLoading || isNoteLoading || isNoteFetching}
            disabled={saveDisabled}
            variant="primary"
            className={clsx(
              saveDisabled && "cursor-not-allowed !bg-gray-300 !text-gray-500"
            )}
            buttonProps={{
              onClick: handleSave,
              disabled: saveDisabled,
            }}
          >
            Save
          </Button>
        </div>
      )}
    </div>
  );
};
