import AppKit
import ImageIO
import UniformTypeIdentifiers

let width = 720
let height = 420
let output = URL(fileURLWithPath: "public/guides/share-google-sheet.gif")

func text(_ value: String, x: CGFloat, y: CGFloat, size: CGFloat = 16, weight: NSFont.Weight = .regular, color: NSColor = .labelColor) {
  let attributes: [NSAttributedString.Key: Any] = [
    .font: NSFont.systemFont(ofSize: size, weight: weight),
    .foregroundColor: color,
  ]
  value.draw(at: NSPoint(x: x, y: y), withAttributes: attributes)
}

func roundedRect(_ rect: NSRect, radius: CGFloat, fill: NSColor, stroke: NSColor? = nil) {
  let path = NSBezierPath(roundedRect: rect, xRadius: radius, yRadius: radius)
  fill.setFill()
  path.fill()
  if let stroke {
    stroke.setStroke()
    path.lineWidth = 1
    path.stroke()
  }
}

func frame(step: Int) -> CGImage {
  let image = NSImage(size: NSSize(width: width, height: height))
  image.lockFocus()
  NSColor(calibratedWhite: 0.96, alpha: 1).setFill()
  NSRect(x: 0, y: 0, width: width, height: height).fill()

  roundedRect(NSRect(x: 28, y: 30, width: 664, height: 360), radius: 12, fill: .white, stroke: NSColor(calibratedWhite: 0.82, alpha: 1))
  roundedRect(NSRect(x: 48, y: 330, width: 32, height: 32), radius: 4, fill: NSColor(calibratedRed: 0.11, green: 0.66, blue: 0.35, alpha: 1))
  text("S", x: 58, y: 337, size: 17, weight: .bold, color: .white)
  text("MyExpense Tracker", x: 92, y: 339, size: 18, weight: .semibold)
  roundedRect(NSRect(x: 574, y: 330, width: 92, height: 34), radius: 17, fill: NSColor(calibratedRed: 0.08, green: 0.48, blue: 0.92, alpha: 1))
  text("Share", x: 597, y: 339, size: 15, weight: .semibold, color: .white)

  if step == 0 {
    text("1", x: 536, y: 336, size: 22, weight: .bold, color: NSColor.systemRed)
    text("Open your Google Sheet and click Share", x: 150, y: 190, size: 23, weight: .semibold)
  } else {
    roundedRect(NSRect(x: 145, y: 75, width: 430, height: 235), radius: 12, fill: .white, stroke: NSColor(calibratedWhite: 0.76, alpha: 1))
    text("Share \"MyExpense Tracker\"", x: 170, y: 274, size: 19, weight: .semibold)
    text("Add people, groups, or service account", x: 170, y: 235, size: 13, color: .secondaryLabelColor)
    roundedRect(NSRect(x: 170, y: 190, width: 380, height: 38), radius: 5, fill: NSColor(calibratedWhite: 0.98, alpha: 1), stroke: step == 1 ? NSColor.systemBlue : NSColor(calibratedWhite: 0.8, alpha: 1))
    text(step == 1 ? "Paste the service-account email" : "service-account@project.iam.gserviceaccount.com", x: 182, y: 201, size: 13, color: step == 1 ? .secondaryLabelColor : .labelColor)

    if step >= 2 {
      text("Access", x: 170, y: 157, size: 13, weight: .medium)
      roundedRect(NSRect(x: 424, y: 143, width: 126, height: 34), radius: 5, fill: NSColor(calibratedWhite: 0.95, alpha: 1), stroke: NSColor(calibratedWhite: 0.8, alpha: 1))
      text("Editor  ✓", x: 449, y: 153, size: 14, weight: .medium)
    }
    if step == 3 {
      roundedRect(NSRect(x: 454, y: 94, width: 96, height: 34), radius: 17, fill: NSColor(calibratedRed: 0.08, green: 0.48, blue: 0.92, alpha: 1))
      text("Send", x: 484, y: 103, size: 15, weight: .semibold, color: .white)
      text("Then return to MyExpense and paste the Sheet URL", x: 178, y: 48, size: 16, weight: .semibold, color: NSColor(calibratedRed: 0.08, green: 0.48, blue: 0.92, alpha: 1))
    }
  }

  image.unlockFocus()
  return image.cgImage(forProposedRect: nil, context: nil, hints: nil)!
}

try FileManager.default.createDirectory(at: output.deletingLastPathComponent(), withIntermediateDirectories: true)
guard let destination = CGImageDestinationCreateWithURL(output as CFURL, UTType.gif.identifier as CFString, 4, nil) else {
  fatalError("Could not create GIF")
}
CGImageDestinationSetProperties(destination, [kCGImagePropertyGIFDictionary: [kCGImagePropertyGIFLoopCount: 0]] as CFDictionary)
for step in 0..<4 {
  let properties = [kCGImagePropertyGIFDictionary: [kCGImagePropertyGIFDelayTime: 1.8]] as CFDictionary
  CGImageDestinationAddImage(destination, frame(step: step), properties)
}
guard CGImageDestinationFinalize(destination) else { fatalError("Could not save GIF") }
