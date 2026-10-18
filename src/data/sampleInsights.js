// Data from the data science pipeline (latest_audit_results/insights.json).
// To refresh: re-run the DS script, then replace everything after the first line below
// with `export const sampleInsights = ` + the new insights.json + `;`

export const sampleInsights = {
  "source": "ds-pipeline",
  "generatedAt": "2026-10-13",
  "totals": {
    "sitesScanned": 38,
    "successful": 36,
    "blocked": 2,
    "violations": 142
  },
  "scores": {
    "mean": 41.4,
    "median": 37.5
  },
  "topViolations": [
    {
      "id": "color-contrast",
      "label": "Text too faint to read",
      "sites": 19
    },
    {
      "id": "link-name",
      "label": "Links with no readable text",
      "sites": 18
    },
    {
      "id": "target-size",
      "label": "Touch targets too small",
      "sites": 16
    },
    {
      "id": "frame-title",
      "label": "Embedded frames without a title",
      "sites": 12
    },
    {
      "id": "image-alt",
      "label": "Images without alt text",
      "sites": 11
    },
    {
      "id": "aria-required-children",
      "label": "Broken ARIA structure",
      "sites": 9
    },
    {
      "id": "html-has-lang",
      "label": "Page language not declared",
      "sites": 8
    },
    {
      "id": "button-name",
      "label": "Buttons without a name",
      "sites": 7
    },
    {
      "id": "marquee",
      "label": "Scrolling marquee text",
      "sites": 7
    },
    {
      "id": "meta-viewport",
      "label": "Zooming disabled on mobile",
      "sites": 5
    }
  ],
  "severity": [
    {
      "level": "critical",
      "value": 39
    },
    {
      "level": "serious",
      "value": 98
    },
    {
      "level": "moderate",
      "value": 5
    }
  ],
  "tiers": [
    {
      "name": "Central / Apex",
      "sites": 2,
      "meanScore": 87.5,
      "meanCritical": 0.5,
      "meanSerious": 1.5
    },
    {
      "name": "State Portal",
      "sites": 24,
      "meanScore": 40.2,
      "meanCritical": 5.1,
      "meanSerious": 9.2
    },
    {
      "name": "Urban Local Body / Municipal",
      "sites": 10,
      "meanScore": 34.8,
      "meanCritical": 21.4,
      "meanSerious": 18.5
    }
  ],
  "legacy": [
    {
      "id": "marquee",
      "label": "Scrolling marquee text",
      "sites": 7
    },
    {
      "id": "frame-title",
      "label": "Frames without a title",
      "sites": 12
    },
    {
      "id": "html-has-lang",
      "label": "Page language not declared",
      "sites": 8
    }
  ]
};
