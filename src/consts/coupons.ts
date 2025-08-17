import type Coupon from "@/types/coupon";

export const COUPONS: Coupon[] = [
    {
        layers: [
            {
                src: "/coupons/image1.png",
                alt: "coupon"
            }
        ],
        width: 160,
        height: 90,
        alt: "coupon"
    },
    {
        layers: [
            {
                src: "/coupons/image2-bg.png",
                alt: "coupon"
            },
            {
                src: "/coupons/image2.png",
                alt: "coupon",
                offset: 5
            }
        ],
        width: 200,
        height: 100,
        alt: "coupon"
    }
];