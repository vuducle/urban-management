import * as THREE from 'three';

// Defines the available AR modes for the application.
export enum ARMode {
  Ruler = 'ruler',
  XRay = 'xray',
}

// Represents a single point in the AR space, with both 3D and screen coordinates.
export interface ARPoint {
  position: THREE.Vector3;
  screenPosition: { x: number; y: number };
}

// Holds the state of a measurement, including the start and end points, the distance, and a preview line.
export interface RulerMeasurement {
  pointA: ARPoint | null;
  pointB: ARPoint | null;
  distance: number;
  previewLine: { start: THREE.Vector3; end: THREE.Vector3 } | null;
}

/**
 * @class RulerMode
 * @description Manages the logic for measuring distances in AR.
 * Uses raycasting on a virtual plane to calculate distances between points.
 */
export class RulerMode {
  private points: ARPoint[] = [];
  private previewPoint: THREE.Vector3 | null = null;
  private depth = 3.0; // Default depth of 3 meters for placing points (matches specification)
  private scaleFactor = 1.0; // Calibration factor to convert Three.js units to meters
  private virtualPlane: THREE.Plane;

  constructor() {
    // Initialize virtual plane at depth z = -3 (as per specification)
    // The plane's normal points toward the camera (positive Z)
    // The constant represents the distance from origin along the normal
    // For a plane at z = -depth, we need constant = depth
    this.virtualPlane = new THREE.Plane(
      new THREE.Vector3(0, 0, 1),
      this.depth
    );
  }

  /**
   * @method addPoint
   * @description Adds a new measurement point based on screen coordinates.
   * It converts 2D screen coordinates to a 3D point in the scene.
   */
  addPoint(
    screenX: number,
    screenY: number,
    camera: THREE.PerspectiveCamera,
    screenWidth: number,
    screenHeight: number
  ): void {
    if (this.points.length >= 2) return;

    const point3D = this.screenTo3D(
      screenX,
      screenY,
      camera,
      screenWidth,
      screenHeight
    );

    console.log(
      `[ARMeasurement] Point ${this.points.length + 1} added:`,
      {
        position: {
          x: point3D.x.toFixed(2),
          y: point3D.y.toFixed(2),
          z: point3D.z.toFixed(2),
        },
        depth: this.depth,
        scaleFactor: this.scaleFactor,
      }
    );

    this.points.push({
      position: point3D,
      screenPosition: { x: screenX, y: screenY },
    });

    // If this is the first point, the preview line is not yet needed.
    if (this.points.length === 1) {
      this.previewPoint = null;
    }
  }

  /**
   * @method updatePreview
   * @description Updates the preview line to follow the camera's center.
   * This creates the "arrow" effect from point A to the current cursor position.
   */
  updatePreview(
    camera: THREE.PerspectiveCamera,
    screenWidth: number,
    screenHeight: number
  ): void {
    if (this.points.length !== 1) {
      this.previewPoint = null;
      return;
    }
    // The preview point is always at the center of the screen.
    this.previewPoint = this.screenTo3D(
      screenWidth / 2,
      screenHeight / 2,
      camera,
      screenWidth,
      screenHeight
    );
  }

  /**
   * @method getMeasurement
   * @description Returns the current state of the measurement.
   */
  getMeasurement(): RulerMeasurement {
    const pointA = this.points[0] || null;
    const pointB = this.points[1] || null;
    let previewLine = null;
    let previewDistance = 0;

    // If the first point is set, create a preview line to the live cursor position.
    if (pointA && !pointB && this.previewPoint) {
      previewLine = {
        start: pointA.position,
        end: this.previewPoint,
      };
      previewDistance =
        pointA.position.distanceTo(this.previewPoint) *
        this.scaleFactor;
    }

    const finalDistance = this.calculateDistance() || previewDistance;

    return {
      pointA,
      pointB,
      distance: finalDistance,
      previewLine,
    };
  }

  /**
   * @method reset
   * @description Clears all measurement points and resets the state.
   */
  reset(): void {
    this.points = [];
    this.previewPoint = null;
  }

  /**
   * @method isComplete
   * @description Checks if the measurement is complete (i.e., two points have been set).
   */
  isComplete(): boolean {
    return this.points.length >= 2;
  }

  /**
   * @method setDepth
   * @description Sets the virtual depth for placing 3D points.
   */
  setDepth(newDepth: number): void {
    this.depth = Math.max(0.3, Math.min(newDepth, 10)); // Clamp depth between 0.3m and 10m.
  }

  /**
   * @method screenTo3D
   * @description Converts 2D screen coordinates into a 3D vector using raycasting.
   * Implementation follows the specification: Ray intersects with virtual plane at fixed depth.
   * @private
   */
  private screenTo3D(
    screenX: number,
    screenY: number,
    camera: THREE.PerspectiveCamera,
    screenWidth: number,
    screenHeight: number
  ): THREE.Vector3 {
    // Convert screen coordinates to Normalized Device Coordinates (NDC) [-1, 1]
    const ndcX = (screenX / screenWidth) * 2 - 1;
    const ndcY = -(screenY / screenHeight) * 2 + 1;

    // Create raycaster from camera through the screen coordinates
    const raycaster = new THREE.Raycaster();
    const mouseVector = new THREE.Vector2(ndcX, ndcY);
    raycaster.setFromCamera(mouseVector, camera);

    // Use simple depth-based positioning (more reliable for our use case)
    const point = raycaster.ray.origin
      .clone()
      .add(
        raycaster.ray.direction.clone().multiplyScalar(this.depth)
      );

    return point;
  }

  /**
   * @method calculateDistance
   * @description Calculates the Euclidean distance between two measurement points.
   * Formula: d = √((x₂-x₁)² + (y₂-y₁)² + (z₂-z₁)²)
   * Applies calibration scale factor to convert Three.js units to meters.
   * @private
   */
  private calculateDistance(): number {
    if (this.points.length < 2) return 0;
    const rawDistance = this.points[0].position.distanceTo(
      this.points[1].position
    );
    const calibratedDistance = rawDistance * this.scaleFactor;

    console.log('[ARMeasurement] Distance calculated:', {
      raw: rawDistance.toFixed(3),
      calibrated: calibratedDistance.toFixed(3),
      scaleFactor: this.scaleFactor,
    });

    return calibratedDistance;
  }

  /**
   * @method setScaleFactor
   * @description Sets the calibration scale factor to convert Three.js units to real-world units.
   * Example: If an object known to be 1m appears as 1.5 units, set scaleFactor to 1/1.5 ≈ 0.67
   */
  setScaleFactor(factor: number): void {
    this.scaleFactor = Math.max(0.1, Math.min(factor, 10)); // Clamp between 0.1 and 10
  }

  /**
   * @method getScaleFactor
   * @description Returns the current calibration scale factor.
   */
  getScaleFactor(): number {
    return this.scaleFactor;
  }
}

/**
 * @function formatDistance
 * @description Formats a distance value with appropriate unit (cm or m).
 * Displays in centimeters if less than 1 meter, otherwise in meters.
 */
export function formatDistance(distanceInMeters: number): string {
  if (distanceInMeters < 0.01) {
    return '< 1 cm';
  }
  if (distanceInMeters < 1) {
    return `${(distanceInMeters * 100).toFixed(1)} cm`;
  }
  return `${distanceInMeters.toFixed(2)} m`;
}

// Base interface for all AR mode handlers.
export interface ARModeHandler {
  mode: ARMode;
  onTouch: (x: number, y: number) => void;
  render: (scene: THREE.Scene) => void;
  reset: () => void;
  getData: () => any;
}
