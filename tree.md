apwcfs/
├── README.md
├── docs/
│   ├── PRD.md
│   ├── DESIGN.md
│   ├── UNDERSTANDING.md
│   ├── MODEL_OPTIONS.md
│   ├── PROJECT_STRUCTURE.md
│   ├── ARCHITECTURE.md
│   ├── DATA_PIPELINE.md
│   ├── API_SPEC.md
│   ├── XAI.md
│   └── VALIDATION.md
├── frontend/
│   ├── app/
│   │   ├── layout.tsx
│   │   ├── page.tsx
│   │   ├── about/
│   │   │   └── page.tsx
│   │   ├── science/
│   │   │   └── page.tsx
│   │   └── dashboard/
│   │       └── page.tsx
│   ├── components/
│   │   ├── navigation/
│   │   ├── map/
│   │   ├── charts/
│   │   ├── forecast/
│   │   ├── pollution/
│   │   ├── xai/
│   │   └── ui/
│   ├── maps/
│   ├── charts/
│   └── lib/
├── backend/
│   ├── api/
│   ├── services/
│   ├── forecast/
│   └── data/
├── models/
│   ├── wrf-chem/
│   ├── preprocessing/
│   ├── postprocessing/
│   ├── baseline/
│   └── xai/
├── data/
│   ├── raw/
│   ├── processed/
│   └── examples/
├── scripts/
│   ├── ingestion/
│   ├── preprocessing/
│   ├── forecasting/
│   └── evaluation/
├── tests/
└── docker/