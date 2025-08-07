import type Coupon from "@/types/coupon";

export interface CouponClickedEventDetail {
    couponElement: HTMLElement;
    coupon: Coupon;
}

export class CouponClickedEvent extends CustomEvent<CouponClickedEventDetail> {
    constructor(element: HTMLElement, coupon: Coupon) {
        super('show-coupon', {
            bubbles: true,
            cancelable: true,
            composed: true,
            detail: {
                couponElement: element,
                coupon
            }
        });
    }

    get couponElement(): HTMLElement {
        return this.detail.couponElement;
    }

    get coupon(): Coupon {
        return this.detail.coupon;
    }
}

export function makeCoupon(coupon: Coupon): HTMLElement {
    const couponContainer = document.createElement('div');
    couponContainer.setAttribute('coupon-container', '');
    couponContainer.style.aspectRatio = `${coupon.width} / ${coupon.height}`;
    couponContainer.classList.add('relative', 'w-full', 'h-full', 'overflow-hidden');
    couponContainer.style.setProperty('--width', `${coupon.width}px`);
    couponContainer.style.setProperty('--height', `${coupon.height}px`);
    for(const layer of coupon.layers) {
        const imgElement = document.createElement('img');
        imgElement.classList.add('object-cover', 'w-full', 'h-full', '[image-rendering:pixelated]', 'absolute');
        imgElement.setAttribute('data-atropos-offset', `${layer.offset ?? 0}`);
        imgElement.style.setProperty('--width', `${coupon.width}px`);
        imgElement.style.setProperty('--height', `${coupon.height}px`);
        imgElement.src = layer.src;
        imgElement.alt = layer.alt;
        couponContainer.appendChild(imgElement);
    }
    return couponContainer;
}