export default interface Coupon {
    layers: {
        src: string;
        alt: string;
        offset?: number;
    }[];
    width: number;
    height: number;
    alt: string;
}