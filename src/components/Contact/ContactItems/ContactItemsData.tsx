import { IContactItems } from "../../../types/types";

// contact items text
const contactDirectlyText = (
  <>
    nguyenvana@gmail.com
    <br />
    0987 654 321
  </>
);

const headQuaterText = (
  <>123 Đường ABC</>
);

const workWithUsText = (
  <>
    Gửi CV của bạn đến email:
    <br />
    nguyenvana@gmail.com
  </>
);

const customerServiceText = (
  <>
    nguyenvana@gmail.com
    <br />
    0987 654 321
  </>
);

const mediaRelationsText = (
  <>
    nguyenvana@gmail.com
    <br />
    0987 654 321
  </>
);

const vendorSupportText = (
  <>
    nguyenvana@gmail.com
    <br />
    0987 654 321
  </>
);

// contact items data
export const ContactItemsData: IContactItems[] = [
  {
    id: 1,
    title: "Liên hệ trực tiếp",
    content: contactDirectlyText,
  },
  {
    id: 2,
    title: "Chi nhánh chính",
    content: headQuaterText,
  },
  {
    id: 3,
    title: "Cộng tác với chúng tôi",
    content: workWithUsText,
  },
  {
    id: 4,
    title: "Dịch vụ khách hàng",
    content: customerServiceText,
  },
  {
    id: 5,
    title: "Quan hệ truyền thông",
    content: mediaRelationsText,
  },
  {
    id: 6,
    title: "Hỗ trợ đối tác",
    content: vendorSupportText,
  },
];
