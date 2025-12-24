import React, { useMemo, useState } from "react";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import "./EcommercePricingCalculator.css";
import { InputsCard } from "./InputsCard";
import { SummaryCard } from "./SummaryCard";
import { SimulationCard } from "./SimulationCard";
import { ShippingSlabsCard } from "./ShippingSlabsCard";
import {AutoCalculatedCard} from "@/components/pricing/autoCalculatedCard.tsx";
import { AdBanner } from "../AdBanner";

export type Language = "en" | "hi" | "gu";

export type Inputs = {
    productCost: string;
    packagingCost: string;
    weightGrams: string;
    returnRatePct: string;
    returnLogisticsPerReturn: string;
    restockingLossPct: string;
    marketplaceCommissionPct: string;
    gstOnFeesPct: string;
    desiredProfitMarginPct: string;
    overrideSellingPrice: string;
};

export type ShippingSlab = {
    maxWeight: number;
    charge: string;
};

export type CalcResult = {
    shippingCharge: number;
    expectedReturnCostPerOrder: number;
    effectiveCommissionRate: number;
    fixedCostsPerOrder: number;
    breakEvenSP: number;
    recommendedSP: number;
    profitAtRecommendedSP: number;
    feesAtOverrideSP: number;
    totalCostOverrideSP: number;
    profitOverrideSP: number;
    marginOverrideSP: number;
    feesAtRecommendedSP: number;
    profitRecommendedCheck: number;
};

/* ---------- Translations (extended for mini/full copy) ---------- */

const translations = {
    en: {
        language: "Language",
        english: "English",
        hindi: "Hindi",
        gujarati: "Gujarati",

        copySummaryMini: "Copy mini summary",
        copySummaryFull: "Copy full summary",
        downloadPdf: "Download PDF",

        inputsHeader: "Inputs (edit these)",
        autoHeader: "Auto-calculated",
        summaryHeader: "Summary",
        simulationHeader: "Simulation (Override SP)",
        slabsHeader: "Shipping slabs (editable)",

        productCost: "Product cost (ex-factory) ₹",
        productCostInfo: "Base cost you pay manufacturer per unit (without GST).",
        packagingCost: "Packaging cost ₹",
        packagingCostInfo: "Per-unit cost of box, polybag, labels, bubble wrap etc.",
        weightGrams: "Weight (grams)",
        weightGramsInfo:
            "Total shipment weight (product + packaging). Used to pick the shipping slab.",
        returnRatePct: "Return rate %",
        returnRatePctInfo:
            "Approx. % of orders that get returned / RTO. Example: 15 = 15%.",
        returnLogisticsPerReturn: "Return logistics cost per return ₹",
        returnLogisticsPerReturnInfo:
            "Per-return cost for pickup + reverse shipping.",
        restockingLossPct: "Restocking loss % on returns",
        restockingLossPctInfo:
            "Loss if returned item is unsellable / discounted. Example: 50 = 50%.",
        marketplaceCommissionPct: "Marketplace commission %",
        marketplaceCommissionPctInfo:
            "Commission charged by marketplace on selling price.",
        gstOnFeesPct: "GST on fees %",
        gstOnFeesPctInfo: "GST applied on marketplace fees (usually 18%).",
        desiredProfitMarginPct: "Desired profit margin % on SP",
        desiredProfitMarginPctInfo:
            "Target profit as % of selling price. Example: 30 = 30%.",
        overrideSellingPrice: "Override Selling Price (optional) ₹",
        overrideSellingPriceInfo:
            "Set a price to simulate profit / margin; leave blank to ignore.",

        shippingChargeLabel: "Shipping charge (auto from weight) ₹",
        shippingChargeInfo:
            "Picked from the shipping slab table below, based on entered weight.",
        expectedReturnCostPerOrderLabel: "Expected return cost per order ₹",
        expectedReturnCostPerOrderInfo:
            "Average return cost spread across all orders: return rate × (reverse shipping + restocking loss).",
        effectiveCommissionRateLabel: "Effective commission rate on SP",
        effectiveCommissionRateInfo:
            "Marketplace commission plus GST on that commission, as a single % of selling price.",
        fixedCostsPerOrderLabel:
            "Fixed costs per order (cost + pack + ship + returns) ₹",
        fixedCostsPerOrderInfo:
            "Total cost per order before marketplace commission and profit.",
        breakEvenSPLabel: "Break-even Selling Price (0% profit) ₹",
        breakEvenSPInfo:
            "Minimum selling price where you neither profit nor lose.",
        recommendedSPLabel: "Recommended Selling Price for desired margin ₹",
        recommendedSPInfo:
            "Price that should give approximately your target profit margin after all costs.",
        profitAtRecommendedSPLabel: "Profit at recommended SP ₹",
        profitAtRecommendedSPInfo:
            "Approximate profit per order if you sell at the recommended price.",

        summaryRecommendedSP: "Recommended Selling Price",
        summaryProfitPerOrder: "Expected profit per order",
        summaryMargin: "Target profit margin",
        summaryOverrideHeader: "Override SP impact",
        summaryOverrideProfit: "Profit at override SP",
        summaryOverrideMargin: "Margin at override SP",

        feesAtOverrideSPLabel: "Fees at override SP ₹",
        totalCostAtOverrideSPLabel: "Total cost at override SP ₹",
        profitAtOverrideSPLabel: "Profit at override SP ₹",
        marginAtOverrideSPLabel: "Margin at override SP %",
        feesAtRecommendedSPLabel: "Fees at recommended SP ₹",
        profitRecommendedCheckLabel: "Profit at recommended SP ₹ (check)",

        slabsHint:
            "Change the charges here if your courier / marketplace updates shipping rates. Weight bands are fixed; only charges are editable.",
        currentShippingUsedLabel: "Current shipping used for this product",

        /* Labels used inside copied summary text */
        miniTitle: "Pricing Summary",
        fullTitle: "Detailed Pricing Summary",
        labelSP: "Selling Price",
        labelProfit: "Profit per order",
        labelMargin: "Margin",
        labelShipping: "Shipping",
        labelFixedCost: "Fixed cost per order",
        labelReturnCost: "Return cost per order",
        labelEffectiveComm: "Effective commission",
    },

    // Hindi & Gujarati – only new keys added; rest same as previous answer.
    hi: {
        language: "भाषा",
        english: "English",
        hindi: "हिंदी",
        gujarati: "गुजराती",

        copySummaryMini: "मिनी सारांश कॉपी करें",
        copySummaryFull: "पूरा सारांश कॉपी करें",
        downloadPdf: "PDF डाउनलोड करें",

        inputsHeader: "इनपुट (यहाँ मान बदलें)",
        autoHeader: "स्वतः गणना",
        summaryHeader: "सारांश",
        simulationHeader: "सिमुलेशन (ओवरराइड मूल्य)",
        slabsHeader: "शिपिंग स्लैब (संपादन योग्य)",

        productCost: "उत्पाद लागत (फ़ैक्टरी) ₹",
        productCostInfo: "निर्माता को प्रति यूनिट दी जाने वाली मूल कीमत (GST छोड़कर)।",
        packagingCost: "पैकेजिंग लागत ₹",
        packagingCostInfo: "डिब्बा, पॉलीबैग, लेबल, बबल रैप आदि की प्रति यूनिट लागत।",
        weightGrams: "वज़न (ग्राम)",
        weightGramsInfo:
            "उत्पाद + पैकेजिंग का कुल वज़न। इससे शिपिंग स्लैब चुना जाएगा।",
        returnRatePct: "रिटर्न दर %",
        returnRatePctInfo: "कितने प्रतिशत ऑर्डर वापस आते हैं (RTO/रिटर्न)।",
        returnLogisticsPerReturn: "रिटर्न लॉजिस्टिक लागत ₹",
        returnLogisticsPerReturnInfo: "एक रिटर्न पर कूरियर/पिकअप लागत।",
        restockingLossPct: "रीस्टॉकिंग नुकसान %",
        restockingLossPctInfo:
            "रिटर्न पर उत्पाद खराब / अनुपयोगी हो जाए तो होने वाला प्रतिशत नुकसान।",
        marketplaceCommissionPct: "मार्केटप्लेस कमीशन %",
        marketplaceCommissionPctInfo: "विक्रय मूल्य पर मार्केटप्लेस द्वारा लिया गया कमीशन।",
        gstOnFeesPct: "फीस पर GST %",
        gstOnFeesPctInfo: "कमीशन व अन्य शुल्क पर लगने वाला GST (आमतौर पर 18%)।",
        desiredProfitMarginPct: "इच्छित लाभ मार्जिन %",
        desiredProfitMarginPctInfo:
            "विक्रय मूल्य पर आपका लक्ष्य लाभ प्रतिशत। उदाहरण: 30 = 30%।",
        overrideSellingPrice: "ओवरराइड विक्रय मूल्य (वैकल्पिक) ₹",
        overrideSellingPriceInfo:
            "किसी निश्चित विक्रय मूल्य पर लाभ देखने के लिए। खाली छोड़ने पर नज़रअंदाज़ होगा।",

        shippingChargeLabel: "शिपिंग शुल्क (वज़न के आधार पर) ₹",
        shippingChargeInfo:
            "नीचे दिए शिपिंग स्लैब से, आपके वज़न के अनुसार चुना गया शुल्क।",
        expectedReturnCostPerOrderLabel: "प्रति ऑर्डर रिटर्न लागत ₹",
        expectedReturnCostPerOrderInfo:
            "रिटर्न दर × (रिवर्स शिपिंग + रीस्टॉकिंग नुकसान) – सभी ऑर्डर पर औसत।",
        effectiveCommissionRateLabel: "प्रभावी कमीशन दर",
        effectiveCommissionRateInfo:
            "कमीशन + उस पर लगने वाला GST – कुल % के रूप में।",
        fixedCostsPerOrderLabel: "फिक्स्ड लागत प्रति ऑर्डर (उत्पाद + पैक + शिप + रिटर्न) ₹",
        fixedCostsPerOrderInfo:
            "मार्केटप्लेस शुल्क और लाभ से पहले प्रति ऑर्डर कुल लागत।",
        breakEvenSPLabel: "ब्रेक-ईवन विक्रय मूल्य ₹",
        breakEvenSPInfo:
            "वह न्यूनतम मूल्य जहाँ न लाभ होता है न नुकसान।",
        recommendedSPLabel: "अनुशंसित विक्रय मूल्य ₹",
        recommendedSPInfo:
            "वह मूल्य जो आपकी इच्छित लाभ मार्जिन को पूरा करने के लिए उपयुक्त है।",
        profitAtRecommendedSPLabel: "अनुशंसित मूल्य पर लाभ ₹",
        profitAtRecommendedSPInfo:
            "यदि आप अनुशंसित मूल्य पर बेचते हैं तो प्रति ऑर्डर लाभ।",

        summaryRecommendedSP: "अनुशंसित विक्रय मूल्य",
        summaryProfitPerOrder: "प्रति ऑर्डर अनुमानित लाभ",
        summaryMargin: "लक्ष्य लाभ मार्जिन",
        summaryOverrideHeader: "ओवरराइड विक्रय मूल्य का प्रभाव",
        summaryOverrideProfit: "ओवरराइड मूल्य पर लाभ",
        summaryOverrideMargin: "ओवरराइड मूल्य पर लाभ %",

        feesAtOverrideSPLabel: "ओवरराइड मूल्य पर शुल्क ₹",
        totalCostAtOverrideSPLabel: "ओवरराइड मूल्य पर कुल लागत ₹",
        profitAtOverrideSPLabel: "ओवरराइड मूल्य पर लाभ ₹",
        marginAtOverrideSPLabel: "ओवरરाइड मूल्य पर मार्जिन %",
        feesAtRecommendedSPLabel: "अनुशंसित मूल्य पर शुल्क ₹",
        profitRecommendedCheckLabel: "अनुशंसित मूल्य पर लाभ ₹ (जांच)",

        slabsHint:
            "यदि आपका कूरियर / मार्केटप्लेस शिपिंग शुल्क बदलता है तो यहाँ अपडेट करें। वज़न स्लैब फिक्स हैं।",
        currentShippingUsedLabel: "इस उत्पाद के लिए उपयोग किया गया शिपिंग शुल्क",

        miniTitle: "प्राइसिंग सारांश",
        fullTitle: "विस्तृत प्राइसिंग सारांश",
        labelSP: "विक्रय मूल्य",
        labelProfit: "लाभ प्रति ऑर्डर",
        labelMargin: "मार्जिन",
        labelShipping: "शिपिंग",
        labelFixedCost: "फिक्स्ड लागत",
        labelReturnCost: "रिटर्न लागत",
        labelEffectiveComm: "प्रभावी कमीशन",
    },

    gu: {
        language: "ભાષા",
        english: "English",
        hindi: "Hindi",
        gujarati: "ગુજરાતી",

        copySummaryMini: "મિની સારાંશ નકલ કરો",
        copySummaryFull: "પૂરો સારાંશ નકલ કરો",
        downloadPdf: "PDF ડાઉનલોડ કરો",

        inputsHeader: "ઇનપુટ (અહીં મૂલ્ય બદલો)",
        autoHeader: "સ્વયં ગણતરી",
        summaryHeader: "સારાંશ",
        simulationHeader: "સિમ્યુલેશન (ઓવરરાઈડ ભાવ)",
        slabsHeader: "શિપિંગ સ્લેબ (ફેરફાર કરી શકાય)",

        productCost: "ઉત્પાદન કિંમત ₹",
        productCostInfo: "પ્રતિ યુનિટ ફેક્ટરી કિંમત (GST વગર).",
        packagingCost: "પેકેજિંગ ખર્ચ ₹",
        packagingCostInfo: "બોક્સ, બેગ, લેબલ, બબલ રેપ વગેરેનો ખર્ચ.",
        weightGrams: "વજન (ગ્રામ)",
        weightGramsInfo:
            "ઉત્પાદ + પેકેજિંગનું કુલ વજન. તે પરથી શિપિંગ સ્લેબ પસંદ થાય છે.",
        returnRatePct: "રીટર્ન દર %",
        returnRatePctInfo: "કેટલા ટકા ઓર્ડર પાછા આવે છે (RTO/રીટર્ન).",
        returnLogisticsPerReturn: "રીટર્ન લોજિસ્ટિક ખર્ચ ₹",
        returnLogisticsPerReturnInfo: "એક રીટર્ન પર લાગતો કુરિયર/પિકઅપ ખર્ચ.",
        restockingLossPct: "રીસ્ટોકિંગ નુકસાન %",
        restockingLossPctInfo:
            "રીટર્ન થયેલ માલ વેચાણ લાયક ન રહે તો થતું નુકસાન (ટકા માં).",
        marketplaceCommissionPct: "માર્કેટપ્લેસ કમિશન %",
        marketplaceCommissionPctInfo: "વેચાણ કિંમત પર લેવાતો કમિશન.",
        gstOnFeesPct: "ફી પર GST %",
        gstOnFeesPctInfo: "કમિશન અને ફી પર લાગતો GST (સામાન્ય રીતે 18%).",
        desiredProfitMarginPct: "ઇચ્છિત નફો માર્જિન %",
        desiredProfitMarginPctInfo:
            "વેચાણ કિંમત પર ઇચ્છિત નફો ટકા. ઉદાહરણ: 30 = 30%.",
        overrideSellingPrice: "ઓવરરાઇડ વેચાણ કિંમત ₹",
        overrideSellingPriceInfo:
            "ખાસ વેચાણ કિંમત પર નફો ચકાસવા માટે. ખાલી રાખો તો અવગણશે.",

        shippingChargeLabel: "શિપિંગ ચાર્જ (વજન પરથી) ₹",
        shippingChargeInfo:
            "નીચેના શિપિંગ સ્લેબમાંથી તમારાં વજન પ્રમાણે પસંદ થયેલો ચાર્જ.",
        expectedReturnCostPerOrderLabel: "પ્રતિ ઓર્ડર રીટર્ન ખર્ચ ₹",
        expectedReturnCostPerOrderInfo:
            "રીટર્ન દર × (રીવર્સ શિપિંગ + રીસ્ટોકિંગ નુકસાન) – બધાં ઓર્ડર પર સરેરાશ.",
        effectiveCommissionRateLabel: "અસરકારક કમિશન દર",
        effectiveCommissionRateInfo:
            "કમિશન + તેના પર લાગતો GST – એક કુલ ટકા તરીકે.",
        fixedCostsPerOrderLabel: "સ્થિર ખર્ચ પ્રતિ ઓર્ડર (ઉત્પાદ + પેક + શિપ + રીટર્ન) ₹",
        fixedCostsPerOrderInfo:
            "માર્કેટપ્લેસ ફી અને નફો પહેલા પ્રતિ ઓર્ડર કુલ ખર્ચ.",
        breakEvenSPLabel: "બ્રેક-ઈવન વેચાણ કિંમત ₹",
        breakEvenSPInfo:
            "ન તો નફો, ન તો નુકસાન – એવી નિમ્નતમ વેચાણ કિંમત.",
        recommendedSPLabel: "ભલામણ કરેલી વેચાણ કિંમત ₹",
        recommendedSPInfo:
            "તમારો ઇચ્છિત નફો માર્જિન મેળવવા માટે યોગ્ય કિંમતો.",
        profitAtRecommendedSPLabel: "ભલામણ કરેલી કિંમતે નફો ₹",
        profitAtRecommendedSPInfo:
            "જો તમે ભલામણ કરેલી કિંમતે વેચો તો પ્રતિ ઓર્ડર નફો.",

        summaryRecommendedSP: "ભલામણ કરેલી વેચાણ કિંમત",
        summaryProfitPerOrder: "પ્રતિ ઓર્ડર અપેક્ષિત નફો",
        summaryMargin: "લક્ષિત નફો માર્જિન",
        summaryOverrideHeader: "ઓવરરાઇડ વેચાણ કિંમતનો પ્રભાવ",
        summaryOverrideProfit: "ઓવરરાઇડ કિંમતે નફો",
        summaryOverrideMargin: "ઓવરરાઇડ કિંમતે માર્જિન %",

        feesAtOverrideSPLabel: "ઓવરરાઇડ કિંમતે ફી ₹",
        totalCostAtOverrideSPLabel: "ઓવરરાઇડ કિંમતે કુલ ખર્ચ ₹",
        profitAtOverrideSPLabel: "ઓવરરાઇડ કિંમતે નફો ₹",
        marginAtOverrideSPLabel: "ઓવરરાઇડ કિંમતે માર્જિન %",
        feesAtRecommendedSPLabel: "ભલામણ કરેલી કિંમતે ફી ₹",
        profitRecommendedCheckLabel: "ભલામણ કરેલી કિંમતે નફો ₹ (ચેક)",

        slabsHint:
            "જો તમારું કુરિયર/માર્કેટપ્લેસ શિપિંગ ચાર્જ બદલે તો અહીં અપડેટ કરો. વજન સ્લેબ સ્થિર છે.",
        currentShippingUsedLabel: "આ પ્રોડક્ટ માટે ઉપયોગમાં લેવાયેલ શિપિંગ ચાર્જ",

        miniTitle: "પ્રાઇસિંગ સારાંશ",
        fullTitle: "વિગતવાર પ્રાઇસિંગ સારાંશ",
        labelSP: "વેચાણ કિંમત",
        labelProfit: "નફો પ્રતિ ઓર્ડર",
        labelMargin: "માર્જિન",
        labelShipping: "શિપિંગ",
        labelFixedCost: "સ્થિર ખર્ચ",
        labelReturnCost: "રીટર્ન ખર્ચ",
        labelEffectiveComm: "અસરકારક કમિશન",
    },
} as const;

type T = (typeof translations)["en"];

const toNumber = (value: string): number => {
    const n = parseFloat(value);
    return Number.isFinite(n) ? n : 0;
};

export const EcommercePricingCalculator: React.FC = () => {
    const [lang, setLang] = useState<Language>("en");
    const t: T = translations[lang];

    const [inputs, setInputs] = useState<Inputs>({
        productCost: "100",
        packagingCost: "10",
        weightGrams: "120",
        returnRatePct: "15",
        returnLogisticsPerReturn: "60",
        restockingLossPct: "50",
        marketplaceCommissionPct: "15",
        gstOnFeesPct: "18",
        desiredProfitMarginPct: "30",
        overrideSellingPrice: "",
    });

    const [shippingSlabs, setShippingSlabs] = useState<ShippingSlab[]>([
        { maxWeight: 100, charge: "40" },
        { maxWeight: 250, charge: "45" },
        { maxWeight: 500, charge: "50" },
        { maxWeight: 1000, charge: "70" },
        { maxWeight: 1500, charge: "85" },
        { maxWeight: 2000, charge: "100" },
    ]);

    const handleInputChange = (field: keyof Inputs, value: string) => {
        setInputs((prev) => ({ ...prev, [field]: value }));
    };

    const handleSlabChargeChange = (index: number, value: string) => {
        setShippingSlabs((prev) =>
            prev.map((s, i) => (i === index ? { ...s, charge: value } : s))
        );
    };

    const lookupShipping = (weightGrams: number): number => {
        if (!Number.isFinite(weightGrams) || weightGrams <= 0) return 0;
        for (const slab of shippingSlabs) {
            const chargeNum = toNumber(slab.charge);
            if (weightGrams <= slab.maxWeight) return chargeNum;
        }
        const last = shippingSlabs[shippingSlabs.length - 1];
        return toNumber(last.charge);
    };

    const calc: CalcResult = useMemo(() => {
        const productCost = toNumber(inputs.productCost);
        const packagingCost = toNumber(inputs.packagingCost);
        const weightGrams = toNumber(inputs.weightGrams);
        const returnRate = toNumber(inputs.returnRatePct) / 100;
        const returnLogisticsPerReturn = toNumber(inputs.returnLogisticsPerReturn);
        const restockingLoss = toNumber(inputs.restockingLossPct) / 100;
        const marketplaceCommission =
            toNumber(inputs.marketplaceCommissionPct) / 100;
        const gstOnFees = toNumber(inputs.gstOnFeesPct) / 100;
        const desiredProfitMargin =
            toNumber(inputs.desiredProfitMarginPct) / 100;
        const overrideSP = toNumber(inputs.overrideSellingPrice);

        const shippingCharge = lookupShipping(weightGrams);

        const expectedReturnCostPerOrder =
            returnRate *
            (returnLogisticsPerReturn +
                restockingLoss * (productCost + packagingCost));

        const effectiveCommissionRate =
            marketplaceCommission * (1 + gstOnFees);

        const fixedCostsPerOrder =
            productCost + packagingCost + shippingCharge + expectedReturnCostPerOrder;

        const breakEvenSP =
            1 - effectiveCommissionRate > 0
                ? fixedCostsPerOrder / (1 - effectiveCommissionRate)
                : NaN;

        const recommendedSP =
            1 - desiredProfitMargin - effectiveCommissionRate > 0
                ? fixedCostsPerOrder /
                (1 - desiredProfitMargin - effectiveCommissionRate)
                : NaN;

        const profitAtRecommendedSP = Number.isFinite(recommendedSP)
            ? recommendedSP * desiredProfitMargin
            : NaN;

        const hasOverride = overrideSP > 0;

        const feesAtOverrideSP = hasOverride
            ? overrideSP * effectiveCommissionRate
            : NaN;
        const totalCostOverrideSP = hasOverride
            ? fixedCostsPerOrder + feesAtOverrideSP
            : NaN;
        const profitOverrideSP = hasOverride
            ? overrideSP - totalCostOverrideSP
            : NaN;
        const marginOverrideSP = hasOverride
            ? profitOverrideSP / overrideSP
            : NaN;

        const feesAtRecommendedSP = Number.isFinite(recommendedSP)
            ? recommendedSP * effectiveCommissionRate
            : NaN;

        const profitRecommendedCheck = Number.isFinite(recommendedSP)
            ? recommendedSP - fixedCostsPerOrder - feesAtRecommendedSP
            : NaN;

        return {
            shippingCharge,
            expectedReturnCostPerOrder,
            effectiveCommissionRate,
            fixedCostsPerOrder,
            breakEvenSP,
            recommendedSP,
            profitAtRecommendedSP,
            feesAtOverrideSP,
            totalCostOverrideSP,
            profitOverrideSP,
            marginOverrideSP,
            feesAtRecommendedSP,
            profitRecommendedCheck,
        };
    }, [inputs, shippingSlabs]);

    /* ---------- Copy summary (mini / full) ---------- */

    const buildSummaryText = (mode: "mini" | "full"): string => {
        const marginPct = toNumber(inputs.desiredProfitMarginPct);
        const lines: string[] = [];

        if (mode === "mini") {
            lines.push(
                `${t.miniTitle}`,
                "----------------------",
                `${t.summaryRecommendedSP}: ₹${calc.recommendedSP.toFixed(2)}`,
                `${t.summaryProfitPerOrder}: ₹${calc.profitAtRecommendedSP.toFixed(2)}`,
                `${t.summaryMargin}: ${marginPct.toFixed(2)}%`
            );
            return lines.join("\n");
        }

        // full summary
        lines.push(
            `${t.fullTitle}`,
            "----------------------",
            `${t.summaryRecommendedSP}: ₹${calc.recommendedSP.toFixed(2)}`,
            `${t.summaryProfitPerOrder}: ₹${calc.profitAtRecommendedSP.toFixed(2)}`,
            `${t.summaryMargin}: ${marginPct.toFixed(2)}%`,
            "",
            `${t.labelShipping}: ₹${calc.shippingCharge.toFixed(2)}`,
            `${t.labelReturnCost}: ₹${calc.expectedReturnCostPerOrder.toFixed(2)}`,
            `${t.labelFixedCost}: ₹${calc.fixedCostsPerOrder.toFixed(2)}`,
            `${t.labelEffectiveComm}: ${(calc.effectiveCommissionRate * 100).toFixed(
                2
            )}%`,
            `${t.breakEvenSPLabel}: ₹${calc.breakEvenSP.toFixed(2)}`
        );

        if (toNumber(inputs.overrideSellingPrice) > 0) {
            lines.push(
                "",
                t.summaryOverrideHeader,
                `${t.summaryOverrideProfit}: ₹${calc.profitOverrideSP.toFixed(2)}`,
                `${t.summaryOverrideMargin}: ${(calc.marginOverrideSP * 100).toFixed(
                    2
                )}%`
            );
        }

        return lines.join("\n");
    };

    const handleCopySummary = (mode: "mini" | "full") => {
        const text = buildSummaryText(mode);
        navigator.clipboard.writeText(text);
        alert(
            mode === "mini"
                ? "Mini summary copied to clipboard."
                : "Full summary copied to clipboard."
        );
    };

    /* ---------- PDF download (same as before) ---------- */

    const handleDownloadPdf = async () => {
        const element = document.getElementById("pricing-calculator-root");
        if (!element) return;

        const canvas = await html2canvas(element, { scale: 2 });
        const imgData = canvas.toDataURL("image/png");
        const pdf = new jsPDF("p", "mm", "a4");
        const pdfWidth = pdf.internal.pageSize.getWidth();
        const imgProps = pdf.getImageProperties(imgData);
        const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;

        pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
        pdf.save("pricing-summary.pdf");
    };

    const hasOverride = toNumber(inputs.overrideSellingPrice) > 0;

    return (
        
        <div className="w-full">
             <div className="my-6">
                            <AdBanner />
                          </div>
            <div className="bg-white p-6 sm:p-8 rounded-lg shadow-md">              
            <header className="calc-header">
                <div className="top-row">
                    <div className="badge">Smart E-commerce Price Planner</div>
                    <div className="lang-switch">
                        <label>{t.language}:</label>
                        <select
                            value={lang}
                            onChange={(e) => setLang(e.target.value as Language)}
                        >
                            <option value="en">{t.english}</option>
                            <option value="hi">{t.hindi}</option>
                            <option value="gu">{t.gujarati}</option>
                        </select>
                    </div>
                </div>

                <h1>E-commerce Pricing Calculator</h1>
                <p className="subtitle">
                    Plan your Meesho / Amazon listing price with returns, commission and
                    shipping already included.
                </p>

                <div className="actions-row">
                    <button
                        className="copy-btn secondary"
                        onClick={() => handleCopySummary("mini")}
                    >
                        📋 {t.copySummaryMini}
                    </button>
                    <button
                        className="copy-btn"
                        onClick={() => handleCopySummary("full")}
                    >
                        📋 {t.copySummaryFull}
                    </button>
                    <button className="pdf-btn" onClick={handleDownloadPdf}>
                        📄 {t.downloadPdf}
                    </button>
                </div>
            </header>

            <div id="pricing-calculator-root" className="calc-grid">
                <InputsCard t={t} inputs={inputs} onChange={handleInputChange} />

                <AutoCalculatedCard t={t} calc={calc} />

                <SummaryCard
                    t={t}
                    calc={calc}
                    desiredMarginPct={toNumber(inputs.desiredProfitMarginPct)}
                    hasOverride={hasOverride}
                />

                <SimulationCard t={t} calc={calc} />

                <ShippingSlabsCard
                    t={t}
                    shippingSlabs={shippingSlabs}
                    onSlabChange={handleSlabChargeChange}
                    currentShipping={calc.shippingCharge}
                />
            </div>
            </div>
        </div>
    );
};
