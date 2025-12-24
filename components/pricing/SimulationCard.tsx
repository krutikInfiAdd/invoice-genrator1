import React from "react";
import { CalcResult } from "./EcommercePricingCalculator";

type Props = {
    t: any;
    calc: CalcResult;
};

export const SimulationCard: React.FC<Props> = ({ t, calc }) => {
    const row = (label: string, value: string, highlight = false) => (
        <div
            className={`field readonly ${highlight ? "highlight" : ""}`}
            key={label}
        >
            <label>{label}</label>
            <div>{value}</div>
        </div>
    );

    return (
        <section className="card">
            <h2>{t.simulationHeader}</h2>

            {row(
                t.feesAtOverrideSPLabel,
                `₹${calc.feesAtOverrideSP.toFixed(2)}`
            )}
            {row(
                t.totalCostAtOverrideSPLabel,
                `₹${calc.totalCostOverrideSP.toFixed(2)}`
            )}
            {row(
                t.profitAtOverrideSPLabel,
                `₹${calc.profitOverrideSP.toFixed(2)}`,
                true
            )}
            {row(
                t.marginAtOverrideSPLabel,
                `${(calc.marginOverrideSP * 100).toFixed(2)}%`,
                true
            )}
            {row(
                t.feesAtRecommendedSPLabel,
                `₹${calc.feesAtRecommendedSP.toFixed(2)}`
            )}
            {row(
                t.profitRecommendedCheckLabel,
                `₹${calc.profitRecommendedCheck.toFixed(2)}`
            )}
        </section>
    );
};
