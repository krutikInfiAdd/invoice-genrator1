import React from "react";
import { ShippingSlab } from "./EcommercePricingCalculator";

type Props = {
    t: any;
    shippingSlabs: ShippingSlab[];
    onSlabChange: (index: number, value: string) => void;
    currentShipping: number;
};

export const ShippingSlabsCard: React.FC<Props> = ({
                                                       t,
                                                       shippingSlabs,
                                                       onSlabChange,
                                                       currentShipping,
                                                   }) => {
    return (
        <section className="card">
            <h2>
                {t.slabsHeader}
            </h2>
            <p className="hint">{t.slabsHint}</p>

            <table className="slab-table">
                <thead>
                <tr>
                    <th>Weight up to (g)</th>
                    <th>Shipping charge ₹</th>
                </tr>
                </thead>
                <tbody>
                {shippingSlabs.map((s, index) => (
                    <tr key={s.maxWeight}>
                        <td>{s.maxWeight}</td>
                        <td>
                            <input
                                type="number"
                                className="slab-charge-input"
                                value={s.charge}
                                onChange={(e) => onSlabChange(index, e.target.value)}
                            />
                        </td>
                    </tr>
                ))}
                </tbody>
            </table>

            <div className="field readonly">
                <label>{t.currentShippingUsedLabel}</label>
                <div>₹{currentShipping.toFixed(2)}</div>
            </div>
        </section>
    );
};
