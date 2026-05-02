import { SITE_URL} from "@/lib/config.ts";

export function PharmacyJsonLd() {
    const schema = {
        '@context': 'https://schema.org',
        '@type': 'Pharmacy',
        name: 'Tuğra Eczanesi',
        alternateName: ['Tugra Pharmacy', 'Аптека Тугра', 'Tuğra Apotheke'],
        url: SITE_URL,
        telephone: '+902427152409',
        address: {
            '@type': 'PostalAddress',
            streetAddress: '46. Sk. No:3',
            addressLocality: 'Belek',
            addressRegion: 'Antalya',
            postalCode: '07506',
            addressCountry: 'TR',
        },
        geo: {
            '@type': 'GeoCoordinates',
            latitude: 36.8644,
            longitude: 31.0556,
        },
        openingHours: 'Mo-Su 08:00-22:00',
        openingHoursSpecification: {
            '@type': 'OpeningHoursSpecification',
            dayOfWeek: ['Monday','Tuesday','Wednesday','Thursday','Friday','Saturday','Sunday'],
            opens: '08:00',
            closes: '22:00',
        },
        hasMap: 'https://maps.app.goo.gl/aF7kWSV46eGwWg298',
        availableLanguage: [
            { '@type': 'Language', name: 'Turkish' },
            { '@type': 'Language', name: 'English' },
            { '@type': 'Language', name: 'Russian' },
            { '@type': 'Language', name: 'German' },
        ],
    }

    return (
        <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
        />
    )
}