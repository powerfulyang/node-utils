use std::collections::HashMap;

use serde::{Deserialize, Serialize};
use wasm_bindgen::prelude::*;

mod hamming_distance;

#[derive(Serialize, Deserialize)]
pub struct Asset {
    id: u32,
    p_hash: String,
}

pub struct AssetBinary {
    id: u32,
    p_hash: u64,
}

#[wasm_bindgen]
pub fn calculate_hamming_distances(assets: &JsValue) -> Result<JsValue, JsValue> {
    let assets: Vec<Asset> =
        serde_wasm_bindgen::from_value(assets.clone()).map_err(|err| err.to_string())?;

    // p_hash is a binary string, so we need to convert it to a u64
    let assets: Vec<AssetBinary> = assets
        .into_iter()
        .map(|asset| AssetBinary {
            p_hash: u64::from_str_radix(&asset.p_hash, 2).unwrap_or(0),
            id: asset.id,
        })
        .collect::<Vec<AssetBinary>>();

    let mut distance_map = HashMap::new();

    for next in assets.iter() {
        for asset in assets.iter() {
            if asset.id == next.id {
                continue;
            }

            let distance = (asset.p_hash ^ next.p_hash).count_ones();

            if distance <= 10 {
                distance_map
                    .entry(asset.id)
                    .or_insert_with(Vec::new)
                    .push((next.id, distance));
                distance_map
                    .entry(next.id)
                    .or_insert_with(Vec::new)
                    .push((asset.id, distance));
            }
        }
    }

    serde_wasm_bindgen::to_value(&distance_map).map_err(|err| err.to_string().into())
}
