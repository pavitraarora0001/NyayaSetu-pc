
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

    // Generate Guidance
    const guidance = [
        "This incident appears to be legally actionable.",
        matchedSections.some(s => s.cognizable) ? "Since this is a cognizable offence, police are duty-bound to register an FIR." : "This may be a non-cognizable offence; police may record an NCR.",
        "Preserve any digital or physical evidence immediately.",
        "Visit your nearest police station to formally report this."
    ];

    return {
        summary: `Incident involves elements of ${matchedSections.map(s => s.description.split(" - ")[0]).join(", ")}.`,
        sections: matchedSections,
        guidance: guidance,
        riskLevel: isHighRisk ? 'High' : 'Medium'
    };
}
