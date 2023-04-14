use wasm_bindgen::prelude::*;

#[wasm_bindgen]
pub fn binary_hamming_distance(a: &str, b: &str) -> u32 {
    let a = u64::from_str_radix(a, 2).unwrap_or(0);
    let b = u64::from_str_radix(b, 2).unwrap_or(0);
    (a ^ b).count_ones()
}
