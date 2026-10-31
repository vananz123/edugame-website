import { revalidatePath } from "next/cache";

// Làm mới trang public sau khi admin lưu/publish (không cần deploy lại).
export function revalidatePublic() {
  revalidatePath("/vi");
  revalidatePath("/en");
}