package com.sentinelshield.android

import android.Manifest
import android.content.Context
import android.content.pm.PackageManager
import android.os.Build
import android.os.SystemClock
import android.telephony.*
import androidx.annotation.RequiresApi
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
        val timestampElapsedRealtimeMs: Long?,
        val channelNumber: Int? = null
    )

    fun collect(): Evidence {
        val captured = Instant.ofEpochMilli(System.currentTimeMillis()).toString()
        val nowElapsedRealtimeMs = SystemClock.elapsedRealtime()
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
        val freshness = calculateCellFreshness(
            hasCells = cells.isNotEmpty(),
            nowElapsedRealtimeMs = nowElapsedRealtimeMs,
            timestampsElapsedRealtimeMs = cells.mapNotNull { it.timestampElapsedRealtimeMs },
            ttlMillis = 300_000L
        )
        return Evidence(captured, "Android TelephonyManager/SubscriptionManager", freshness.status, freshness.ageMillis, subscriptions, cells, "device_observed_cell_info")
    }

    private fun hasFineLocation() = ContextCompat.checkSelfPermission(context, Manifest.permission.ACCESS_FINE_LOCATION) == PackageManager.PERMISSION_GRANTED
    private fun hasPhoneState() = ContextCompat.checkSelfPermission(context, Manifest.permission.READ_PHONE_STATE) == PackageManager.PERMISSION_GRANTED

    private fun mapCell(info: CellInfo): CellEvidence {
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.Q) {
            when (info) {
                is CellInfoNr -> return mapNrCell(info)
                is CellInfoTdscdma -> return mapTdscdmaCell(info)
            }
        }

        return when (info) {
            is CellInfoLte -> {
                val id = info.cellIdentity
                val s = info.cellSignalStrength
                CellEvidence(
                    "LTE", info.isRegistered, mcc(id), mnc(id),
                    id.ci.takeUnless { it == CellInfo.UNAVAILABLE }?.toLong(),
                    id.tac.takeUnless { it == CellInfo.UNAVAILABLE },
                    id.pci.takeUnless { it == CellInfo.UNAVAILABLE },
                    s.rsrp.takeUnless { it == CellInfo.UNAVAILABLE },
                    s.level.takeUnless { it == 0 },
                    timestampElapsedRealtimeMs(info)
                )
            }
            is CellInfoWcdma -> {
                val id = info.cellIdentity
                val s = info.cellSignalStrength
                CellEvidence(
                    "WCDMA", info.isRegistered, mcc(id), mnc(id),
                    id.cid.takeUnless { it == CellInfo.UNAVAILABLE }?.toLong(),
                    id.lac.takeUnless { it == CellInfo.UNAVAILABLE },
                    id.psc.takeUnless { it == CellInfo.UNAVAILABLE },
                    s.dbm.takeUnless { it == CellInfo.UNAVAILABLE },
                    s.level.takeUnless { it == 0 },
                    timestampElapsedRealtimeMs(info)
                )
            }
            is CellInfoGsm -> {
                val id = info.cellIdentity
                val s = info.cellSignalStrength
                CellEvidence(
                    "GSM", info.isRegistered, mcc(id), mnc(id),
                    id.cid.takeUnless { it == CellInfo.UNAVAILABLE }?.toLong(),
                    id.lac.takeUnless { it == CellInfo.UNAVAILABLE },
                    id.bsic.takeUnless { it == CellInfo.UNAVAILABLE },
                    s.dbm.takeUnless { it == CellInfo.UNAVAILABLE },
                    s.level.takeUnless { it == 0 },
                    timestampElapsedRealtimeMs(info)
                )
            }
            else -> CellEvidence(
                "UNKNOWN", info.isRegistered, null, null, null, null, null,
                null, null, timestampElapsedRealtimeMs(info)
            )
        }
    }

    @RequiresApi(Build.VERSION_CODES.Q)
    private fun mapNrCell(info: CellInfoNr): CellEvidence {
        val id = info.cellIdentity
        val signal = info.cellSignalStrength
        val identity = mapNrIdentityFields(id.tac, id.nrarfcn, CellInfo.UNAVAILABLE)
        return CellEvidence(
            "NR",
            info.isRegistered,
            id.mccString,
            id.mncString,
            id.nci.takeUnless { it == CellInfo.UNAVAILABLE_LONG },
            identity.areaCode,
            id.pci.takeUnless { it == CellInfo.UNAVAILABLE },
            signal.ssRsrp.takeUnless { it == CellInfo.UNAVAILABLE },
            signal.level.takeUnless { it == 0 },
            timestampElapsedRealtimeMs(info),
            identity.channelNumber
        )
    }

    @RequiresApi(Build.VERSION_CODES.Q)
    private fun mapTdscdmaCell(info: CellInfoTdscdma): CellEvidence {
        val id = info.cellIdentity
        val signal = info.cellSignalStrength
        return CellEvidence(
            "TD-SCDMA",
            info.isRegistered,
            id.mccString,
            id.mncString,
            id.cid.takeUnless { it == CellInfo.UNAVAILABLE }?.toLong(),
            id.lac.takeUnless { it == CellInfo.UNAVAILABLE },
            id.cpid.takeUnless { it == CellInfo.UNAVAILABLE },
            signal.dbm.takeUnless { it == CellInfo.UNAVAILABLE },
            signal.level.takeUnless { it == 0 },
            timestampElapsedRealtimeMs(info)
        )
    }

    private fun timestampElapsedRealtimeMs(info: CellInfo): Long? {
        val rawTimestamp = if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.R) {
            info.timestampMillis
        } else {
            info.timeStamp
        }
        return cellTimestampToElapsedRealtimeMillis(rawTimestamp, Build.VERSION.SDK_INT)
    }

    private fun mcc(id: CellIdentityLte): String? =
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.P) id.mccString
        else id.mcc.takeUnless { it == CellInfo.UNAVAILABLE }?.toString()

    private fun mnc(id: CellIdentityLte): String? =
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.P) id.mncString
        else id.mnc.takeUnless { it == CellInfo.UNAVAILABLE }?.toString()

    private fun mcc(id: CellIdentityWcdma): String? =
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.P) id.mccString
        else id.mcc.takeUnless { it == CellInfo.UNAVAILABLE }?.toString()

    private fun mnc(id: CellIdentityWcdma): String? =
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.P) id.mncString
        else id.mnc.takeUnless { it == CellInfo.UNAVAILABLE }?.toString()

    private fun mcc(id: CellIdentityGsm): String? =
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.P) id.mccString
        else id.mcc.takeUnless { it == CellInfo.UNAVAILABLE }?.toString()

    private fun mnc(id: CellIdentityGsm): String? =
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.P) id.mncString
        else id.mnc.takeUnless { it == CellInfo.UNAVAILABLE }?.toString()

}
