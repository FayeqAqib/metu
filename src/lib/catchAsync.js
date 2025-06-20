import { auth } from "./auth";
import { connectDB } from "./db";

export const catchAsync = (fn) => async (data) => {
  const session = await auth();
  if (!session)
    return {
      result: null,
      err: "فقد افراد ثبت نام کرده می توانند استفاده کنند",
    };
  try {
    await connectDB();
    const result = await fn(data);
    return { result: JSON.parse(JSON.stringify(result)), err: false };
  } catch (err) {
    return { result: null, err };
  }
};
