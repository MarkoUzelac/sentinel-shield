package com.sentinelshield.android

import org.junit.Assert.assertEquals
import org.junit.Assert.assertNull
import org.junit.Test

class CellularEvidenceRulesTest {
    @Test
    fun `API 29 nanosecond timestamps are converted to elapsed realtime milliseconds`() {
        assertEquals(1_500L, cellTimestampToElapsedRealtimeMillis(1_500_000_000L, 29))
    }

    @Test
    fun `API 30 millisecond timestamps are preserved`() {
        assertEquals(1_500L, cellTimestampToElapsedRealtimeMillis(1_500L, 30))
    }

    @Test
    fun `zero or negative timestamps are unavailable`() {
        assertNull(cellTimestampToElapsedRealtimeMillis(0L, 30))
        assertNull(cellTimestampToElapsedRealtimeMillis(-1L, 29))
    }

    @Test
    fun `freshness uses elapsed realtime rather than wall clock time`() {
        val result = calculateCellFreshness(
            hasCells = true,
            nowElapsedRealtimeMs = 1_000_000L,
            timestampsElapsedRealtimeMs = listOf(990_000L),
            ttlMillis = 300_000L
        )

        assertEquals(10_000L, result.ageMillis)
        assertEquals("ACTIVE", result.status)
    }

    @Test
    fun `cell evidence older than TTL is stale`() {
        val result = calculateCellFreshness(
            hasCells = true,
            nowElapsedRealtimeMs = 1_000_000L,
            timestampsElapsedRealtimeMs = listOf(600_000L),
            ttlMillis = 300_000L
        )

        assertEquals(400_000L, result.ageMillis)
        assertEquals("STALE", result.status)
    }

    @Test
    fun `cells without a usable timestamp are unverified`() {
        val result = calculateCellFreshness(
            hasCells = true,
            nowElapsedRealtimeMs = 1_000_000L,
            timestampsElapsedRealtimeMs = emptyList(),
            ttlMillis = 300_000L
        )

        assertNull(result.ageMillis)
        assertEquals("ACTIVE_UNVERIFIED", result.status)
    }

    @Test
    fun `empty cell list is unavailable`() {
        val result = calculateCellFreshness(
            hasCells = false,
            nowElapsedRealtimeMs = 1_000_000L,
            timestampsElapsedRealtimeMs = emptyList(),
            ttlMillis = 300_000L
        )

        assertNull(result.ageMillis)
        assertEquals("UNAVAILABLE", result.status)
    }

    @Test
    fun `NR TAC and NRARFCN are kept in separate fields`() {
        val result = mapNrIdentityFields(
            tac = 123_456,
            nrarfcn = 640_000,
            unavailableValue = Int.MAX_VALUE
        )

        assertEquals(123_456, result.areaCode)
        assertEquals(640_000, result.channelNumber)
    }

    @Test
    fun `unavailable NR identity values remain null`() {
        val result = mapNrIdentityFields(
            tac = Int.MAX_VALUE,
            nrarfcn = Int.MAX_VALUE,
            unavailableValue = Int.MAX_VALUE
        )

        assertNull(result.areaCode)
        assertNull(result.channelNumber)
    }
}
