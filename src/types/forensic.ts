export interface RestrictedSupplier {
  id: string
  supplierName: string
  restrictionType: string | null
  status: string | null
  reference: string | null
}

export interface RestrictedSupplierMatch {
  restricted: boolean
  match: RestrictedSupplier | null
}
