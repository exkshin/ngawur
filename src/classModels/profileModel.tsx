export interface ProfileModel {
  idperusahaan?: string | null;        // ID of the company
  iduser?: string | null;              // ID of the user
  userid?: string | null;              // User ID
  username?: string | null;            // Username
  pass?: string | null;                // Password (hashed)
  fingerprint1?: string | null;        // Fingerprint data (if any)
  fingerprint2?: string | null;        // Fingerprint data (if any)
  authentication?: string | null;      // Authentication method (if any)
  priority?: string | null;            // User priority (if any)
  aksesutama?: string | null;          // Main access level (if any)
  otorisasi?: string | null;           // Authorization level (if any)
  tampilgrandtotal?: string | null;    // Display grand total (if any)
  printulang?: string | null;          // Print again option (if any)
  blokir?: string | null;              // Block status (if any)
  hp?: string | null;                  // Phone number (if any)
  email?: string | null;               // Email address
  gambar?: string | null;              // Image filename
  idperkiraan?: string | null;         // Account ID (if any)
  catatan?: string | null;             // Notes (if any)
  userentry?: string | null;           // User entry ID
  tglentry?: string | null;            // Entry date and time
  status?: string | null;              // Status (e.g., active/inactive)
  gambarpath?: string | null;
}