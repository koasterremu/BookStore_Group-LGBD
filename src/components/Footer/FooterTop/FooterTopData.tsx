import { ILinks } from "../../../types/types";

export const LinksData: ILinks[] = [
    {
        id: 1,
        title: "Liên kết nhanh",
        links: [
            {id: 1, title: "Chính sách", href: "#/"},
            {id: 2, title: "Điều khoản & Điều kiện", href: "#/"},
            {id: 3, title: "Vận chuyển", href: "#/"},
            {id: 4, title: "Hoàn trả", href: "#/"},
            {id: 5, title: "Câu hỏi thường gặp", href: "#/"}
        ]
    },
    {
        id: 2,
        title: "Công ty",
        links: [
            {id: 1, title: "Về chúng tôi", href: "/about"},
            {id: 2, title: "Đối tác", href: "#/"},
            {id: 3, title: "Tuyển dụng", href: "#/"},
            {id: 4, title: "Liên hệ", href: "/contact"}
        ]
    },
    {
        id: 3,
        title: "Kinh doanh",
        links: [
            {id: 1, title: "Báo chí của chúng tôi", href: "#/"},
            {id: 2, title: "Thanh toán", href: "#/"},
            {id: 3, title: "Vận chuyển", href: "#/"},
            {id: 4, title: "Tài khoản của tôi", href: "#/"},
            {id: 5, title: "Cửa hàng", href: "#/"}
        ]
    }
];