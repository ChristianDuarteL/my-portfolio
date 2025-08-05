export interface CouponClickedEventDetail {
    coupon: HTMLElement;
}

export class CouponClickedEvent extends CustomEvent<CouponClickedEventDetail> {
    constructor(coupon: HTMLElement) {
        super('show-coupon', {
            bubbles: true,
            cancelable: true,
            composed: true,
            detail: {
                coupon
            }
        });
    }

    get coupon(): HTMLElement {
        return this.detail.coupon;
    }
}
