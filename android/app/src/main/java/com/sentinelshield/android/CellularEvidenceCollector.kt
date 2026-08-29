package com.sentinelshield.android

import android.Manifest
import android.content.Context
import android.content.pm.PackageManager
import android.os.Build
import android.telephony.*
import androidx.core.content.ContextCompat
import java.time.Instant

/** Collects only device-observed cellular evidence. No synthetic cells or random values. */
class CellularEvidenceCollector(private val context: Context) {
    data class Evidence(
        val capturedAt: String,
        val source: String,
        val status: String,
        val freshnessMs: Long?,
        val subscriptions: List<SubscriptionEvidence>,
        val cells: List<CellEvidence>,
        val provenance: String
    )

    data class SubscriptionEvidence(
        val subscriptionId: Int,
        val simSlotIndex: Int,
        val carrierName: String?
    )

    data class CellEvidence(
        val technology: String,
        val registered: Boolean,
        val mcc: String?,
        val mnc: String?,
        val cellId: Long?,
        val areaCode: Int?,
        val pci: Int?,
        val signalDbm: Int?,
        val signalLevel: Int?,
        val timestampMillis: Long?
    )

    fun collect(): Evidence {
        val now = System.currentTimeMillis()
        val captured = Instant.ofEpochMilli(now).toString()
        if (!hasFineLocation() || !hasPhoneState()) {
            return Evidence(captured, "Android TelephonyManager/SubscriptionManager", "UNAVAILABLE", null, emptyList(), emptyList(), "runtime_permission_missing")
        }
        val tm = context.getSystemService(TelephonyManager::class.java)
        val sm = context.getSystemService(SubscriptionManager::class.java)
        val subscriptions = try {
            sm.activeSubscriptionInfoList.orEmpty().map {
                SubscriptionEvidence(it.subscriptionId, it.simSlotIndex, it.carrierName?.toString())
            }
        } catch (_: SecurityException) { emptyList() }

        val cells = mutableListOf<CellEvidence>()
        val infos = try { tm.allCellInfo.orEmpty() } catch (_: SecurityException) { emptyList() }
        for (info in infos) cells += mapCell(info)
        val freshest = cells.mapNotNull { it.timestampMillis }.maxOrNull()
        val age = freshest?.let { (now - it).coerceAtLeast(0) }
        val status = when {
            cells.isEmpty() -> "UNAVAILABLE"
            age == null -> "ACTIVE_UNVERIFIED"
            age <= 300_000L -> "ACTIVE"
            else -> "STALE"
        }
        return Evidence(captured, "Android TelephonyManager/SubscriptionManager", status, age, subscriptions, cells, "device_observed_cell_info")
    }

    private fun hasFineLocation() = ContextCompat.checkSelfPermission(context, Manifest.permission.ACCESS_FINE_LOCATION) == PackageManager.PERMISSION_GRANTED
    private fun hasPhoneState() = ContextCompat.checkSelfPermission(context, Manifest.permission.READ_PHONE_STATE) == PackageManager.PERMISSION_GRANTED

    private fun mapCell(info: CellInfo): CellEvidence = when (info) {
        is CellInfoLte -> {
            val id = info.cellIdentity
            val s = info.cellSignalStrength
            CellEvidence("LTE", info.isRegistered, id.mccString, id.mncString, id.ci.toLongOrNull(), id.tac, id.pci, s.rsrp.takeUnless { it == CellInfo.UNAVAILABLE }, s.level, info.timestampMillis)
        }
        is CellInfoNr -> {
            val id = info.cellIdentity as CellIdentityNr
            val s = info.cellSignalStrength as CellSignalStrengthNr
            CellEvidence("NR", info.isRegistered, id.mccString, id.mncString, id.nci, id.nrarfcn, id.pci, s.ssRsrp.takeUnless { it == CellInfo.UNAVAILABLE }, s.level, info.timestampMillis)
        }
        is CellInfoWcdma -> {
            val id = info.cellIdentity
            val s = info.cellSignalStrength
            CellEvidence("WCDMA", info.isRegistered, id.mccString, id.mncString, id.cid.toLongOrNull(), id.lac, id.psc, s.dbm.takeUnless { it == CellInfo.UNAVAILABLE }, s.level, info.timestampMillis)
        }
        is CellInfoGsm -> {
            val id = info.cellIdentity
            val s = info.cellSignalStrength
            CellEvidence("GSM", info.isRegistered, id.mccString, id.mncString, id.cid.toLongOrNull(), id.lac, id.bsic, s.dbm.takeUnless { it == CellInfo.UNAVAILABLE }, s.level, info.timestampMillis)
        }
        is CellInfoTdscdma -> {
            val id = info.cellIdentity
            val s = info.cellSignalStrength
            CellEvidence("TD-SCDMA", info.isRegistered, id.mccString, id.mncString, id.cid.toLongOrNull(), id.lac, id.cpid, s.dbm.takeUnless { it == CellInfo.UNAVAILABLE }, s.level, info.timestampMillis)
        }
        else -> CellEvidence("UNKNOWN", info.isRegistered, null, null, null, null, null, null, null, info.timestampMillis)
    }
}
