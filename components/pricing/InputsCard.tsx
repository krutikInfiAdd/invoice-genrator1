import React from "react";
import { Inputs } from "./EcommercePricingCalculator";

type InputsCardProps = {
    t: any;
    inputs: Inputs;
    onChange: (field: keyof Inputs, value: string) => void;
};

export const InputsCard: React.FC<InputsCardProps> = ({
                                                          t,
                                                          inputs,
                                                          onChange,
                                                      }) => {
    const field = (name: keyof Inputs, label: string, info: string, type = "number") => (
        <div className="field" key={name}>
            <label>
                {label}
                <span className="info-icon" data-tooltip={info}>
          i
        </span>
            </label>
            <input
                type={type}
                value={inputs[name]}
                onChange={(e) => onChange(name, e.target.value)}
            />
        </div>
    );

    return (
        <section className="card">
            <h2>{t.inputsHeader}</h2>

            {field("productCost", t.productCost, t.productCostInfo)}
            {field("packagingCost", t.packagingCost, t.packagingCostInfo)}
            {field("weightGrams", t.weightGrams, t.weightGramsInfo)}
            {field("returnRatePct", t.returnRatePct, t.returnRatePctInfo)}
            {field(
                "returnLogisticsPerReturn",
                t.returnLogisticsPerReturn,
                t.returnLogisticsPerReturnInfo
            )}
            {field("restockingLossPct", t.restockingLossPct, t.restockingLossPctInfo)}
            {field(
                "marketplaceCommissionPct",
                t.marketplaceCommissionPct,
                t.marketplaceCommissionPctInfo
            )}
            {field("gstOnFeesPct", t.gstOnFeesPct, t.gstOnFeesPctInfo)}
            {field(
                "desiredProfitMarginPct",
                t.desiredProfitMarginPct,
                t.desiredProfitMarginPctInfo
            )}
            {field(
                "overrideSellingPrice",
                t.overrideSellingPrice,
                t.overrideSellingPriceInfo
            )}
        </section>
    );
};
