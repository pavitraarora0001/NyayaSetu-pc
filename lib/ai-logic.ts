
// lib/ai-logic.ts

export interface LegalSection {
    section: string; // BNS Section
    ipc_section: string; // Legacy IPC Reference
    description: string;
    punishment: string;
    bailable: boolean;
    cognizable: boolean;
}

export interface AnalysisResult {
    summary: string;
    sections: LegalSection[];
    guidance: string[];
    riskLevel: 'Low' | 'Medium' | 'High';
}

const BNS_DB = [
    {
        keywords: ['theft', 'stolen', 'robbed', 'snatched', 'pocket', 'lost', 'chor', 'chori'],
        section: {
            section: "BNS 303(2)",
            ipc_section: "IPC 379",
            description: "Theft - Dishonest taking of movable property",
            punishment: "Up to 3 years imprisonment or fine or both",
            bailable: false,
            cognizable: true
        }
    },
    {
        keywords: ['robbery', 'loot', 'force', 'weapon', 'dacoity'],
        section: {
            section: "BNS 309",
            ipc_section: "IPC 392",
            description: "Robbery - Theft with force or fear of death/hurt",
            punishment: "Rigorous imprisonment up to 10 years and fine",
            bailable: false,
            cognizable: true
        }
    },
    {
        keywords: ['hit', 'slap', 'punch', 'beat', 'attack', 'fight', 'hurt', 'maar', 'peeta'],
        section: {
            section: "BNS 115(2)",
            ipc_section: "IPC 323",
            description: "Voluntarily causing hurt",
            punishment: "Up to 1 year imprisonment or fine",
            bailable: true,
            cognizable: false
        }
    },
    {
        keywords: ['knife', 'sword', 'weapon', 'rod', 'stab', 'cut', 'bleed', 'shoot', 'gun'],
        section: {
            section: "BNS 118(1)",
            ipc_section: "IPC 324",
            description: "Voluntarily causing hurt by dangerous weapons",
            punishment: "Up to 3 years imprisonment",
            bailable: true,
            cognizable: true
        }
    },
    {
        keywords: ['grievous', 'fracture', 'broken', 'bone', 'eye', 'ear', 'permanent'],
        section: {
            section: "BNS 117(2)",
            ipc_section: "IPC 325",
            description: "Voluntarily causing grievous hurt",
            punishment: "Up to 7 years imprisonment and fine",
            bailable: true,
            cognizable: true
        }
    },
    {
        keywords: ['cheat', 'fraud', 'scam', 'money', 'bank', 'online', 'upi', 'otp'],
        section: {
            section: "BNS 318(4)",
            ipc_section: "IPC 420",
            description: "Cheating and dishonestly inducing delivery of property",
            punishment: "Up to 7 years imprisonment and fine",
            bailable: false,
            cognizable: true
        }
    },
    {
        keywords: ['kill', 'murder', 'dead', 'death', 'killed'],
        section: {
            section: "BNS 103(1)",
            ipc_section: "IPC 302",
            description: "Murder",
            punishment: "Death or life imprisonment",
            bailable: false,
            cognizable: true
        }
    },
    {
        keywords: ['attempt to murder', 'tried to kill', 'neck', 'throat', 'strangle'],
        section: {
            section: "BNS 109",
            ipc_section: "IPC 307",
            description: "Attempt to Murder",
            punishment: "Up to 10 years imprisonment (Life if hurt caused)",
            bailable: false,
            cognizable: true
        }
    },
    {
        keywords: ['rape', 'sexual', 'force', 'assault', 'woman', 'girl', 'minor'],
        section: {
            section: "BNS 64",
            ipc_section: "IPC 376",
            description: "Rape & Sexual Assault",
            punishment: "Rigorous imprisonment not less than 10 years",
            bailable: false,
            cognizable: true
        }
    },
    {
        keywords: ['kidnap', 'missing', 'child', 'taken away', 'abduct'],
        section: {
            section: "BNS 137(2)",
            ipc_section: "IPC 363",
            description: "Kidnapping",
            punishment: "Up to 7 years imprisonment and fine",
            bailable: true,
            cognizable: true
        }
    },
    {
        keywords: ['defamation', 'reputation', 'slander', 'libel', 'bad name', 'insult'],
        section: {
            section: "BNS 356(2)",
            ipc_section: "IPC 500",
            description: "Defamation",
            punishment: "Up to 2 years imprisonment or fine",
            bailable: true,
            cognizable: false
        }
    },
    {
        keywords: ['threat', 'intimidation', 'kill you', 'burn', 'destroy'],
        section: {
            section: "BNS 351(2)",
            ipc_section: "IPC 506",
            description: "Criminal Intimidation",
            punishment: "Up to 2 years imprisonment",
            bailable: true,
            cognizable: false
        }
    },
    {
        keywords: ['suicide', 'kill myself', 'die', 'end my life'],
        section: {
            section: "Mental Healthcare Act",
            ipc_section: "Sec 115",
            description: "Presumed Severe Stress - Immediate Assistance Required",
            punishment: "Protection & Care (Decriminalized)",
            bailable: true,
            cognizable: false
        }
    }
];

export function analyzeIncident(text: string): AnalysisResult {
    const lowerText = text.toLowerCase();
    const matchedSections: LegalSection[] = [];

    // Keyword formulation
    BNS_DB.forEach(entry => {
        if (entry.keywords.some(k => lowerText.includes(k))) {
            matchedSections.push(entry.section);
        }
    });

    // Default if no match
    if (matchedSections.length === 0) {
        return {
            summary: "The incident description is insufficient to determine specific legal sections. Please provide more details.",
            sections: [],
            guidance: ["Please visit the nearest police station for manual assistance."],
            riskLevel: 'Low'
        };
    }

    // Determine Risk Level based on sections
    const isHighRisk = matchedSections.some(s => s.punishment.includes("7 years") || s.punishment.includes("life"));

    // Generate Guidance based on the set of matched sections
    const guidance = [
        matchedSections.length > 1
            ? "Multiple potential offences have been identified in this report."
            : "This incident appears to be legally actionable.",
        matchedSections.some(s => s.cognizable)
            ? "Since cognizable offence(s) are involved, police are duty-bound to register an FIR."
            : "These may be non-cognizable offences; police may record an NCR.",
        "Preserve any digital or physical evidence immediately.",
        "A detailed statement for each identified offence should be recorded."
    ];

    const uniqueDescriptions = Array.from(new Set(matchedSections.map(s => s.description.split(" - ")[0])));

    return {
        summary: matchedSections.length > 1
            ? `Incident involves multiple offences: ${uniqueDescriptions.join(", ")}.`
            : `Incident involves elements of ${uniqueDescriptions[0]}.`,
        sections: matchedSections,
        guidance: guidance,
        riskLevel: isHighRisk ? 'High' : (matchedSections.length > 2 ? 'High' : 'Medium')
    };
}

/**
 * Transforms raw incident description into a formal legal narrative for an FIR.
 * Follows the structure of Standard FIR Form No. 1.
 */
export function generateFormalFIR(text: string, sections: LegalSection[], formData?: any): string {
    const date = new Date().toLocaleDateString();
    const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const sectionList = sections.map(s => `${s.section} (${s.ipc_section})`).join(", ");

    let formalText = `FIRST INFORMATION REPORT (Under Section 154 Cr.P.C.)\n`;
    formalText += `(Standard Form No. 1 - Detailed AI Draft)\n`;
    formalText += `======================================================================\n\n`;

    formalText += `1. DISTRICT: [AS PER JURISDICTION]    P.S: [NEAREST STATION]\n`;
    formalText += `   YEAR: ${new Date().getFullYear()}    FIR NO: [PENDING]    DATE: ${date}\n\n`;

    formalText += `2. ACTS & SECTIONS:\n`;
    formalText += `   - Primary Act: Bharatiya Nyaya Sanhita (BNS), 2023\n`;
    formalText += `   - Sections: ${sectionList || "Under Review"}\n\n`;

    formalText += `3. OCCURRENCE OF OFFENCE:\n`;
    formalText += `   - Date/Time: Recorded as per incident metadata.\n`;
    formalText += `   - Information Received at P.S.: ${date} at ${time}\n\n`;

    formalText += `4. TYPE OF INFORMATION: Written / Digital Submission\n\n`;

    formalText += `5. PLACE OF OCCURRENCE:\n`;
    formalText += `   - Precise Location: ${formData?.placeOfOccurrence || "[AS PER INCIDENT REPORT]"}\n`;
    formalText += `   - Distance from P.S.: ${formData?.distanceFromStation || "[TO BE VERIFIED]"}\n\n`;

    formalText += `6. COMPLAINANT / INFORMANT DETAILS:\n`;
    formalText += `   - Name: ${formData?.complainantName || "[AS PER KYC]"}\n`;
    formalText += `   - Contact: ${formData?.complainantPhone || "[AS PER RECORD]"}\n\n`;

    formalText += `7. DETAILS OF ACCUSED: [KNOWN / UNKNOWN / UNDER INVESTIGATION]\n\n`;

    formalText += `8. CONTENTS OF FIR (Narrative Brief Facts):\n`;
    formalText += `----------------------------------------------------------------------\n`;
    formalText += `IT IS RESPECTFULLY SUBMITTED that the complainant ${formData?.complainantName ? `(Shri/Smt. ${formData.complainantName}) ` : ''}reports as follows:\n\n`;

    // Formalizing the raw text
    const formalizedNarrative = text.trim()
        .replace(/^i /i, "The Informant ")
        .replace(/ my /i, " their ")
        .replace(/ me /i, " the Informant ");

    formalText += `"${formalizedNarrative}"\n\n`;

    if (sections.length > 0) {
        formalText += `LEGAL EVALUATION:\n`;
        formalText += `The collective facts stated above disclose the commission of ${sections.some(s => s.cognizable) ? 'COGNIZABLE' : 'NON-COGNIZABLE'} offence(s). `;
        formalText += `The following legal sections are attracted based on the distinct criminal acts reported:\n`;
        sections.forEach((s, i) => {
            formalText += `   (${i + 1}) ${s.description} - Covered under ${s.section} (${s.ipc_section})\n`;
        });
        formalText += `\n`;
    }

    formalText += `9. ACTION TAKEN:\n`;
    formalText += `   Since the above report reveals commission of offence(s) as mentioned at Item No. 2, the case is registered and investigation has been initiated.\n\n`;

    formalText += `[AI GENERATED DRAFT - SUBJECT TO OFFICER VERIFICATION]`;

    return formalText;
}
