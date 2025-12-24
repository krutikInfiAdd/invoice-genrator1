import React from "react";
import { CalcResult } from "./EcommercePricingCalculator";

type Props = {
    t: any;
    calc: CalcResult;
    desiredMarginPct: number;
    hasOverride: boolean;
};

export const SummaryCard: React.FC<Props> = ({
                                                 t,
                                                 calc,
                                                 desiredMarginPct,
                                                 hasOverride,
                                             }) => {
    return (
        <section className="card">
            <h2>{t.summaryHeader}</h2>

            <div className="summary-box">
                <div className="summary-row">
                    <span>{t.summaryRecommendedSP}</span>
                    <strong>₹{calc.recommendedSP.toFixed(2)}</strong>
                </div>
                <div className="summary-row">
                    <span>{t.summaryProfitPerOrder}</span>
                    <strong>₹{calc.profitAtRecommendedSP.toFixed(2)}</strong>
                </div>
                <div className="summary-row">
                    <span>{t.summaryMargin}</span>
                    <strong>{desiredMarginPct.toFixed(2)}%</strong>
                </div>
            </div>

            {hasOverride && (
                <>
                    <h3 className="summary-subtitle">{t.summaryOverrideHeader}</h3>
                    <div className="summary-box secondary">
                        <div className="summary-row">
                            <span>{t.summaryOverrideProfit}</span>
                            <strong>₹{calc.profitOverrideSP.toFixed(2)}</strong>
                        </div>
                        <div className="summary-row">
                            <span>{t.summaryOverrideMargin}</span>
                            <strong>
                                {(calc.marginOverrideSP * 100).toFixed(2)}%
                            </strong>
                        </div>
                    </div>
                </>
            )}
        </section>
    );
};
