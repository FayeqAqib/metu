import { DatePickerWithPresets } from "@/components/myUI/datePacker";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

import { Textarea } from "@/components/ui/textarea";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { SelectInput } from "@/components/myUI/select";
import createAccountAction, {
  updateAccountAction,
} from "@/actions/accountAction";
import { toast } from "sonner";
import { CardTitle } from "@/components/ui/card";
import { format } from "date-fns";

const schema = z.object({
  date: z.date({ required_error: "تاریخ الزامی است" }),
  name: z.string({ required_error: '" ذکر نام فروشنده الزامی است "' }),
  accountType: z.enum(["buyer", "saller", "bank", "employe"]),
  phoneNumber: z.string().optional(),
  address: z.string().optional(),
  email: z.string().optional(),
  details: z.string().optional(),
  amount: z.string().optional(),
  amountType: z.enum(["lend", "borrow"]).default("lend").optional(),
});

const accountTypeOptions = [
  {
    value: "saller",
    label: "فروشنده",
  },
  {
    value: "buyer",
    label: "خریدار",
  },
  {
    value: "bank",
    label: "بانک / صرافی",
  },
  {
    value: "employe",
    label: "کارمند",
  },
];

export function RegisterModal({
  children,
  data = {},
  type = "create",
  open,
  onOpen,
}) {
  const form = useForm({
    resolver: zodResolver(schema),
    defaultValues:
      type === "update"
        ? {
            ...data,
            date: data.date,
          }
        : {},
  });
  async function submiteForm(formData) {
    const newFormData = {
      ...formData,
      lend: formData.amountType === "lend" ? formData.amount : 0,
      borrow: formData.amountType === "borrow" ? formData.amount : 0,
      _id: data._id,
    };
    if (type === "create") {
      const result = await createAccountAction(newFormData);
      if (!result.err) {
        toast.success("حساب شما با موفقیت ایجاد شد");
        form.reset();
        onOpen(false);
      } else {
        toast.error(
          "در ایجاد حساب شما مشکلی به وجود آمده لطفا بعدا دوباره تلاش کنید"
        );
      }
    }
    if (type === "update") {
      const result = await updateAccountAction(newFormData);

      if (!result.err) {
        toast.success("حساب شما با موفقیت آپدیت شد");
        form.reset();
        onOpen(false);
      } else {
        toast.error(
          "در آپدیت حساب شما مشکلی به وجود آمده لطفا بعدا دوباره تلاش کنید"
        );
      }
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpen}>
      {children}
      <DialogContent className=" lg:w-[600px]">
        <DialogHeader>
          <DialogTitle className={"text-right"}>
            {type == "update" ? "تصحیح" : " حساب جدید "}
          </DialogTitle>
          <DialogDescription className={"text-right"}>
            لطف نموده در درج اطلاعات دقت نمایید.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(submiteForm)}
            className="w-full space-y-6"
          >
            <div className="flex flex-row flex-wrap xs:justify-center justify-between ">
              <FormField
                control={form.control}
                name="date"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel> تاریخ</FormLabel>
                    <DatePickerWithPresets
                      date={field.value}
                      onDate={field.onChange}
                      size="sm"
                    />

                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>اسم</FormLabel>
                    <Input
                      className={"w-[207px]"}
                      value={field.value}
                      onChange={field.onChange}
                    />
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="flex flex-row flex-wrap xs:justify-center justify-between ">
              <FormField
                control={form.control}
                name="accountType"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>نوع حساب</FormLabel>
                    <SelectInput
                      disabled={type === "update"}
                      field={field}
                      options={accountTypeOptions}
                      lable={"نوع حساب"}
                    />

                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="phoneNumber"
                type="number"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel> شماره تماس</FormLabel>
                    <Input
                      className={"w-[207px]"}
                      value={field.value}
                      onChange={field.onChange}
                    />
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="flex flex-row flex-wrap xs:justify-center justify-between ">
              <FormField
                control={form.control}
                name="address"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel> آدرس</FormLabel>
                    <Input
                      className={"w-[207px]"}
                      value={field.value}
                      onChange={field.onChange}
                    />
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel> ایمیل آدرس </FormLabel>
                    <Input
                      className={"w-[207px]"}
                      type={"email"}
                      value={field.value}
                      onChange={field.onChange}
                    />
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <FormField
              control={form.control}
              name="details"
              render={({ field }) => (
                <FormItem>
                  <FormLabel> تفصیلات</FormLabel>
                  <Textarea
                    className={"w-auto "}
                    value={field.value}
                    onChange={field.onChange}
                  />
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="dark:bg-[#003f3c] bg-[#008f88] rounded-lg shadow-lg p-3 shadow-[#000000c2] dark:shadow-[#1f1f1f] space-y-5">
              <CardTitle className={"font-extrabold"}>
                رسید حسابات سابقه
              </CardTitle>
              <div className="flex flex-row flex-wrap xs:justify-center justify-between ">
                <FormField
                  control={form.control}
                  name="amount"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel> مبلغ</FormLabel>
                      <Input
                        className={"w-[207px] "}
                        value={field.value}
                        onChange={field.onChange}
                      />
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="amountType"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel> نوعیت حساب</FormLabel>
                      <SelectInput
                        field={field}
                        lable={"نوعیت"}
                        options={[
                          { value: "lend", label: "از ما قرضدار است" },
                          { value: "borrow", label: "ما از او قرضدار استیم" },
                        ]}
                      />
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>
            <div className="flex justify-end gap-2.5">
              <DialogClose asChild>
                <Button
                  onClick={() => form.reset()}
                  type="button"
                  variant={"outline"}
                >
                  انصراف
                </Button>
              </DialogClose>
              <Button type="submit">ذخیره کردن</Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
