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
 */
export class RulerMode {
  private points: ARPoint[] = [];
  private previewPoint: THREE.Vector3 | null = null;
  private depth = 2.0; // Default depth of 2 meters for placing points.

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
      previewDistance = pointA.position.distanceTo(this.previewPoint);
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
   * @description Converts 2D screen coordinates into a 3D vector in the world space.
   * @private
   */
  private screenTo3D(
    screenX: number,
    screenY: number,
    camera: THREE.PerspectiveCamera,
    screenWidth: number,
    screenHeight: number
  ): THREE.Vector3 {
    // Convert screen coordinates to Normalized Device Coordinates (NDC) [-1, 1].
    const ndcX = (screenX / screenWidth) * 2 - 1;
    const ndcY = -(screenY / screenHeight) * 2 + 1;

    // Use a raycaster to project the point into the 3D scene.
    const raycaster = new THREE.Raycaster();
    const mouseVector = new THREE.Vector2(ndcX, ndcY);
    raycaster.setFromCamera(mouseVector, camera);

    // Place the point at the currently configured depth along the ray.
    return raycaster.ray.origin
      .clone()
      .add(
        raycaster.ray.direction.clone().multiplyScalar(this.depth)
      );
  }

  /**
   * @method calculateDistance
   * @description Calculates the distance between the two measurement points.
   * @private
   */
  private calculateDistance(): number {
    if (this.points.length < 2) return 0;
    return this.points[0].position.distanceTo(
      this.points[1].position
    );
  }
}

// Base interface for all AR mode handlers.
export interface ARModeHandler {
  mode: ARMode;
  onTouch: (x: number, y: number) => void;
  render: (scene: THREE.Scene) => void;
  reset: () => void;
  getData: () => any;
}
