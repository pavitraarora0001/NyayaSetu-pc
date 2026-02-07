
import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

const DB_PATH = path.join(process.cwd(), 'data', 'incidents.json');

// Helper to read DB
const readDB = () => {
    try {
        if (!fs.existsSync(DB_PATH)) {
            // Write empty array if file doesn't exist
            fs.writeFileSync(DB_PATH, '[]', 'utf-8');
            return [];
        }
        const data = fs.readFileSync(DB_PATH, 'utf-8');
        return JSON.parse(data);
    } catch (error) {
        console.error('Error reading DB:', error);
        return [];
    }
};

// Helper to write DB
const writeDB = (data: any) => {
    try {
        fs.writeFileSync(DB_PATH, JSON.stringify(data, null, 2), 'utf-8');
    } catch (error) {
        console.error('Error writing DB:', error);
    }
};

export async function GET() {
    const incidents = readDB();
    return NextResponse.json(incidents);
}

export async function POST(request: Request) {
    try {
        const body = await request.json();

        // Basic validation
        if (!body.description) {
            return NextResponse.json({ error: 'Description is required' }, { status: 400 });
        }

        const incidents = readDB();

        const newIncident = {
            id: `INC-${new Date().getFullYear()}-${String(incidents.length + 1).padStart(3, '0')}`,
            description: body.description,
            analysis: body.analysis || {}, // Securely store the AI result too
            type: body.analysis?.sections?.[0]?.section ? 'Identified Offence' : 'General Report', // Simple type derivation
            location: body.metadata?.location || 'Reported Online',
            time: body.metadata?.incidentTime || new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
            date: body.metadata?.incidentDate || new Date().toLocaleDateString(),
            metadata: body.metadata || {}, // Save full metadata
            status: body.status || 'New',
            hidden: false // Default to visible
        };

        incidents.unshift(newIncident); // Add to top
        writeDB(incidents);

        return NextResponse.json(newIncident, { status: 201 });

    } catch (error) {
        return NextResponse.json({ error: 'Failed to save incident' }, { status: 500 });
    }
}

export async function PUT(request: Request) {
    try {
        const body = await request.json();

        if (!body.id) {
            return NextResponse.json({ error: 'Incident ID is required' }, { status: 400 });
        }

        const incidents = readDB();
        const index = incidents.findIndex((i: any) => i.id === body.id);

        if (index === -1) {
            return NextResponse.json({ error: 'Incident not found' }, { status: 404 });
        }

        // Update fields
        incidents[index] = { ...incidents[index], ...body };
        writeDB(incidents);

        return NextResponse.json(incidents[index]);

    } catch (error) {
        return NextResponse.json({ error: 'Failed to update incident' }, { status: 500 });
    }
}
