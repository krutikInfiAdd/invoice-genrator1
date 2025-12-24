import React from "react";
import { CalcResult } from "./EcommercePricingCalculator";

type Props = {
    t: any;
    calc: CalcResult;
};

export const AutoCalculatedCard: React.FC<Props> = ({ t, calc }) => {
    const row = (
        label: string,
        value: string,
        info?: string,
        highlight = false
    ) => (
        <div
            className={`field readonly ${highlight ? "highlight" : ""}`}
            key={label}
        >
            <label>
                {label}
                {info && (
                    <span className="info-icon" data-tooltip={info}>
            i
          </span>
                )}
            </label>
            <div>{value}</div>
        </div>
    );

    return (
        <section className="card">
            <h2>{t.autoHeader}</h2>

            {row(
                t.shippingChargeLabel,
                `₹${calc.shippingCharge.toFixed(2)}`,
                t.shippingChargeInfo
            )}
            {row(
                t.expectedReturnCostPerOrderLabel,
                `₹${calc.expectedReturnCostPerOrder.toFixed(2)}`,
                t.expectedReturnCostPerOrderInfo
            )}
            {row(
                t.effectiveCommissionRateLabel,
                `${(calc.effectiveCommissionRate * 100).toFixed(2)}%`,
                t.effectiveCommissionRateInfo
            )}
            {row(
                t.fixedCostsPerOrderLabel,
                `₹${calc.fixedCostsPerOrder.toFixed(2)}`,
                t.fixedCostsPerOrderInfo
            )}
            {row(
                t.breakEvenSPLabel,
                `₹${calc.breakEvenSP.toFixed(2)}`,
                t.breakEvenSPInfo
            )}
            {row(
                t.recommendedSPLabel,
                `₹${calc.recommendedSP.toFixed(2)}`,
                t.recommendedSPInfo,
                true
            )}
            {row(
                t.profitAtRecommendedSPLabel,
                `₹${calc.profitAtRecommendedSP.toFixed(2)}`,
                t.profitAtRecommendedSPInfo
            )}
        </section>
    );
};
