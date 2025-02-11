import { zodResolver } from "@hookform/resolvers/zod";
import { Button, Dialog, TextArea, TextField } from "@radix-ui/themes";
import { SubmitHandler, useForm } from "react-hook-form";
import { z } from "zod";
import ErrorFormMessage from "./ErrorFormMessage";
// import { useCreateQuestMutation } from "../../store/quest/quest.api";
import { useNavigate } from "react-router";
import toast from "react-hot-toast";
import { EditableQuest } from "../pages/EditQuestsPage/editQuestTypes";
import { routes } from "../App";
import { useRef } from "react";

const questScheme = z.object({
   name: z.string().nonempty("Provide quest name"),
   description: z.string().nonempty("Provide quest description"),
   time: z.number().optional()
});

export type questData = z.infer<typeof questScheme>;

function wait(seconds: number) {
   return new Promise((resolve) => {
      setTimeout(resolve, seconds * 1000);
   });
}

type NewQuestFormProps = {
   update?: (data: EditableQuest) => void;
   formTitle?: string;
   name?: string;
   description?: string;
   time?: number;
   id?: number;
};

const QuestForm = ({
   update,
   formTitle,
   name,
   description,
   time,
   id
}: NewQuestFormProps) => {
   //  const [createQuest, { isLoading }] = useCreateQuestMutation();
   const navigate = useNavigate();

   const closeButtonRef = useRef<HTMLButtonElement | null>(null);

   const closeModal = () => {
      closeButtonRef.current && closeButtonRef.current.click();
   };

   const {
      register,
      handleSubmit,
      getValues,
      formState: { errors, isSubmitting }
   } = useForm<questData>({
      resolver: zodResolver(questScheme)
   });

   const onSubmit: SubmitHandler<questData> = async ({
      name,
      description,
      time
   }) => {
      const localQuestsString = localStorage.getItem("localQuests");
      let localQuests: EditableQuest[] = [];
      if (localQuestsString) localQuests = JSON.parse(localQuestsString);
      if (!id) {
         const questToSave = {
            id: new Date().getTime(),
            name,
            description,
            time: time || null
         };

         localStorage.setItem(
            "localQuests",
            JSON.stringify([...localQuests, questToSave])
         );
         await wait(0.5);
         navigate(routes.editQuests, { state: { questId: questToSave.id } });
         toast.success("Quest is created");
      } else {
         const questToSave = {
            id: id,
            name,
            description,
            time: time || null
         };
         localStorage.setItem(
            "localQuests",
            JSON.stringify(
               localQuests.map((quest) =>
                  quest.id === id ? questToSave : quest
               )
            )
         );
         await wait(0.5);
         if (update) update(questToSave);
         closeModal();
         toast.success("Quest is updated");
      }
   };

   return (
      <div>
         <form
            onSubmit={handleSubmit(onSubmit)}
            className="max-w-[450px] mx-auto flex flex-col gap-3"
         >
            <Dialog.Title className="text-2xl font-bold text-center">
               {formTitle || "Create new quest"}
            </Dialog.Title>
            <label>
               <p className="font-bold">Name:</p>
               <TextField.Root
                  {...register("name")}
                  placeholder="Mega test"
                  defaultValue={name || ""}
               />
            </label>
            {errors.name && (
               <ErrorFormMessage>{errors.name.message}</ErrorFormMessage>
            )}

            <label>
               <p className="font-bold">Description:</p>
               <TextArea
                  {...register("description")}
                  placeholder="Description"
                  defaultValue={description || ""}
               />
            </label>
            {errors.description && (
               <ErrorFormMessage>{errors.description.message}</ErrorFormMessage>
            )}

            <label>
               <p className="font-bold">Time Limit (in minutes):</p>
               <TextField.Root
                  defaultValue={time || ""}
                  type="number"
                  {...register("time", {
                     setValueAs: (value) => Number(value)
                  })}
                  placeholder="10"
               />
            </label>
            {errors.time && (
               <ErrorFormMessage>{getValues("time")}</ErrorFormMessage>
            )}
            <div className="flex justify-center gap-3 ">
               <Dialog.Close>
                  <Button variant="soft" color="gray" ref={closeButtonRef}>
                     Cancel
                  </Button>
               </Dialog.Close>
               <Button loading={isSubmitting}>Submit</Button>
            </div>
         </form>
      </div>
   );
};

export default QuestForm;
