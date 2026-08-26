/**
 * Multi-Branch and Multi-Plant Management Utilities
 * Allows enterprise customer accounts (e.g. PT Ewindo) to manage multiple manufacturing sites,
 * warehouses, and branch offices with independent GPS coordinates, PICs, and address details.
 */

export type CustomerBranch = {
  id: string;
  branchName: string;
  address: string;
  city: string;
  province?: string | null;
  latitude: number | null;
  longitude: number | null;
  picName?: string | null;
  picPhone?: string | null;
  isPrimary: boolean;
  notes?: string | null;
};

const BRANCHES_DELIMITER_START = "<!-- DSR360_BRANCHES_JSON_START -->";
const BRANCHES_DELIMITER_END = "<!-- DSR360_BRANCHES_JSON_END -->";

export type BaseCustomerLocation = {
  id: string;
  customer_name: string;
  address?: string | null;
  city?: string | null;
  province?: string | null;
  latitude?: number | null;
  longitude?: number | null;
  notes?: string | null;
};

/**
 * Extracts the multi-branch list from customer notes or seeds the primary plant if empty
 */
export function parseCustomerBranches(
  notesText: string | null | undefined,
  customer?: BaseCustomerLocation
): { branches: CustomerBranch[]; rawNotes: string } {
  const notes = notesText || "";
  let branches: CustomerBranch[] = [];
  let cleanNotes = notes;

  const startIndex = notes.indexOf(BRANCHES_DELIMITER_START);
  const endIndex = notes.indexOf(BRANCHES_DELIMITER_END);

  if (startIndex !== -1 && endIndex !== -1 && endIndex > startIndex) {
    const jsonStr = notes
      .substring(startIndex + BRANCHES_DELIMITER_START.length, endIndex)
      .trim();
    try {
      branches = JSON.parse(jsonStr);
    } catch (e) {
      console.warn("Failed to parse customer branches JSON:", e);
    }

    cleanNotes = (
      notes.substring(0, startIndex) +
      notes.substring(endIndex + BRANCHES_DELIMITER_END.length)
    ).trim();
  }

  // If no branches are recorded yet, seed the primary branch from the main customer record
  if (branches.length === 0 && customer) {
    branches.push({
      id: "primary-site",
      branchName: `${customer.customer_name} (Kantor Pusat / Plant 1)`,
      address: customer.address || "Belum ada detail alamat",
      city: customer.city || "Kota Utama",
      province: customer.province || null,
      latitude: customer.latitude || null,
      longitude: customer.longitude || null,
      picName: null,
      picPhone: null,
      isPrimary: true,
      notes: "Pabrik / Kantor Utama",
    });
  }

  return { branches, rawNotes: cleanNotes };
}

/**
 * Serializes the multi-branch list into the notes field while keeping raw user notes intact
 */
export function serializeCustomerBranches(
  branches: CustomerBranch[],
  existingNotes: string | null | undefined
): string {
  const { rawNotes } = parseCustomerBranches(existingNotes);
  const jsonBlock = `${BRANCHES_DELIMITER_START}\n${JSON.stringify(
    branches,
    null,
    2
  )}\n${BRANCHES_DELIMITER_END}`;

  if (!rawNotes.trim()) {
    return jsonBlock;
  }

  return `${rawNotes.trim()}\n\n${jsonBlock}`;
}
