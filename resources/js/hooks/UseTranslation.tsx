import { usePage } from "@inertiajs/react";

interface PageProps {
    translations: Record<string, string>;
    [key: string]: any;
}

export default function useTranslation() {
    // Tambahkan fallback || {} agar tidak error jika props kosong
    const { translations } = usePage<PageProps>().props;
    
    const t = (key: string) => {
        // Jika translations belum dimuat atau key tidak ada, kembalikan key aslinya
        if (!translations || !translations[key]) {
            return key;
        }
        return translations[key];
    };

    return { t };
}