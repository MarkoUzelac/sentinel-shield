package com.sentinelshield.android

internal data class FreshnessResult(
    val ageMillis: Long?,
    val status: String
)

internal data class NrIdentityFields(
    val areaCode: Int?,
    val channelNumber: Int?
)

/**
 * Android CellInfo timestamps use elapsed-realtime time since boot.
 * API 30+ exposes milliseconds; older APIs expose nanoseconds.
 */
internal fun cellTimestampToElapsedRealtimeMillis(rawTimestamp: Long, apiLevel: Int): Long? {
    if (rawTimestamp <= 0L) return null
    return if (apiLevel >= 30) rawTimestamp else rawTimestamp / 1_000_000L
}

internal fun calculateCellFreshness(
    hasCells: Boolean,
    nowElapsedRealtimeMs: Long,
    timestampsElapsedRealtimeMs: List<Long>,
    ttlMillis: Long
): FreshnessResult {
    require(ttlMillis >= 0L) { "TTL must not be negative" }

    if (!hasCells) return FreshnessResult(null, "UNAVAILABLE")

    val freshest = timestampsElapsedRealtimeMs.maxOrNull()
        ?: return FreshnessResult(null, "ACTIVE_UNVERIFIED")

    val age = (nowElapsedRealtimeMs - freshest).coerceAtLeast(0L)
    return FreshnessResult(
        ageMillis = age,
        status = if (age <= ttlMillis) "ACTIVE" else "STALE"
    )
}

/**
 * Keep the 5G Tracking Area Code and NR-ARFCN in their own fields.
 * NR-ARFCN is a radio-channel number, not an area code.
 */
internal fun mapNrIdentityFields(
    tac: Int,
    nrarfcn: Int,
    unavailableValue: Int
): NrIdentityFields = NrIdentityFields(
    areaCode = tac.takeUnless { it == unavailableValue },
    channelNumber = nrarfcn.takeUnless { it == unavailableValue }
)
