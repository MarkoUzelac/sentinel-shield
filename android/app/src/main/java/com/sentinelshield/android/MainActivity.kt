package com.sentinelshield.android

import android.Manifest
import android.os.Bundle
import android.widget.TextView
import androidx.activity.ComponentActivity
import androidx.core.app.ActivityCompat
import androidx.core.content.ContextCompat

class MainActivity : ComponentActivity() {
    private lateinit var output: TextView
    private val permissionRequest = 1001

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        output = TextView(this).apply { setPadding(32, 48, 32, 48); textSize = 14f }
        setContentView(output)
        requestPermissionsIfNeeded()
    }

    private fun requestPermissionsIfNeeded() {
        val missing = arrayOf(Manifest.permission.ACCESS_FINE_LOCATION, Manifest.permission.READ_PHONE_STATE)
            .filter { ContextCompat.checkSelfPermission(this, it) != android.content.pm.PackageManager.PERMISSION_GRANTED }
        if (missing.isNotEmpty()) {
            ActivityCompat.requestPermissions(this, missing.toTypedArray(), permissionRequest)
        } else collect()
    }

    override fun onRequestPermissionsResult(requestCode: Int, permissions: Array<out String>, grantResults: IntArray) {
        super.onRequestPermissionsResult(requestCode, permissions, grantResults)
        if (requestCode == permissionRequest) collect()
    }

    private fun collect() {
        val evidence = CellularEvidenceCollector(this).collect()
        output.text = buildString {
            appendLine("SENTINEL SHIELD — CELLULAR EVIDENCE")
            appendLine("Status: ${evidence.status}")
            appendLine("Source: ${evidence.source}")
            appendLine("Captured: ${evidence.capturedAt}")
            appendLine("Freshness: ${evidence.freshnessMs?.let { "${it} ms" } ?: "UNAVAILABLE"}")
            appendLine("Provenance: ${evidence.provenance}")
            appendLine("Subscriptions: ${evidence.subscriptions.size}")
            appendLine("Observed cells: ${evidence.cells.size}")
            evidence.cells.forEachIndexed { index, cell ->
                appendLine("\nCell #${index + 1}: ${cell.technology} ${if (cell.registered) "REGISTERED" else "OBSERVED"}")
                appendLine("MCC/MNC: ${cell.mcc ?: "UNAVAILABLE"}/${cell.mnc ?: "UNAVAILABLE"}")
                appendLine("Cell ID: ${cell.cellId ?: "UNAVAILABLE"}")
                appendLine("Area: ${cell.areaCode ?: "UNAVAILABLE"}")
                appendLine("PCI: ${cell.pci ?: "UNAVAILABLE"}")
                appendLine("Signal: ${cell.signalDbm?.let { "$it dBm" } ?: "UNAVAILABLE"}")
                appendLine("Timestamp: ${cell.timestampMillis ?: "UNAVAILABLE"}")
            }
        }
    }
}
