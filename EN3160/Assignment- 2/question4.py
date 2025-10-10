import cv2
import numpy as np
import matplotlib.pyplot as plt

def load_images():
    img1 = cv2.imread('graf/img1.ppm')
    img5 = cv2.imread('graf/img5.ppm')
    img1_gray = cv2.cvtColor(img1, cv2.COLOR_BGR2GRAY)
    img5_gray = cv2.cvtColor(img5, cv2.COLOR_BGR2GRAY)
    return img1, img5, img1_gray, img5_gray

def compute_and_match_sift(img1_gray, img5_gray):
    sift = cv2.SIFT_create()
    
    kp1, des1 = sift.detectAndCompute(img1_gray, None)
    kp5, des5 = sift.detectAndCompute(img5_gray, None)
    
    bf = cv2.BFMatcher(cv2.NORM_L2, crossCheck=False)
    matches = bf.knnMatch(des1, des5, k=2)
    
    good_matches = []
    for m, n in matches:
        if m.distance < 0.8 * n.distance:
            good_matches.append(m)
    
    return kp1, kp5, good_matches

def visualize_matches(img1, img5, kp1, kp5, good_matches):
    img_matches = cv2.drawMatches(img1, kp1, img5, kp5, good_matches[:50], None, 
                                   flags=cv2.DrawMatchesFlags_NOT_DRAW_SINGLE_POINTS)
    plt.figure(figsize=(15, 10))
    plt.imshow(cv2.cvtColor(img_matches, cv2.COLOR_BGR2RGB))
    plt.title(f'SIFT Feature Matches (showing 50 of {len(good_matches)} matches)')
    plt.axis('off')
    plt.tight_layout()
    plt.savefig('sift_matches.png', dpi=150, bbox_inches='tight')
    plt.close()

def normalize_points(pts):
    centroid = np.mean(pts, axis=0)
    pts_centered = pts - centroid
    avg_dist = np.mean(np.sqrt(np.sum(pts_centered**2, axis=1)))
    scale = np.sqrt(2) / avg_dist
    
    T = np.array([[scale, 0, -scale * centroid[0]],
                  [0, scale, -scale * centroid[1]],
                  [0, 0, 1]])
    
    return T

def compute_homography(src_pts, dst_pts):
    T_src = normalize_points(src_pts)
    T_dst = normalize_points(dst_pts)
    
    src_normalized = (T_src @ np.hstack([src_pts, np.ones((len(src_pts), 1))]).T).T
    dst_normalized = (T_dst @ np.hstack([dst_pts, np.ones((len(dst_pts), 1))]).T).T
    
    src_normalized = src_normalized[:, :2]
    dst_normalized = dst_normalized[:, :2]
    
    A = []
    for i in range(len(src_normalized)):
        x, y = src_normalized[i][0], src_normalized[i][1]
        u, v = dst_normalized[i][0], dst_normalized[i][1]
        A.append([-x, -y, -1, 0, 0, 0, u*x, u*y, u])
        A.append([0, 0, 0, -x, -y, -1, v*x, v*y, v])
    
    A = np.array(A)
    U, S, Vt = np.linalg.svd(A)
    H_normalized = Vt[-1].reshape(3, 3)
    
    H = np.linalg.inv(T_dst) @ H_normalized @ T_src
    H = H / H[2, 2]
    
    return H

def ransac_homography(src_pts, dst_pts, num_iterations=10000, threshold=3.0):
    max_inliers = []
    best_H = None
    n_points = len(src_pts)
    
    for iteration in range(num_iterations):
        idx = np.random.choice(n_points, 4, replace=False)
        src_subset = src_pts[idx]
        dst_subset = dst_pts[idx]
        
        try:
            H = compute_homography(src_subset, dst_subset)
            
            if H is None or np.any(np.isnan(H)) or np.any(np.isinf(H)):
                continue
            
            src_pts_homogeneous = np.hstack([src_pts, np.ones((n_points, 1))])
            projected = (H @ src_pts_homogeneous.T).T
            
            z_coords = projected[:, 2]
            if np.any(np.abs(z_coords) < 1e-8):
                continue
                
            projected = projected[:, :2] / z_coords.reshape(-1, 1)
            
            if np.any(np.isnan(projected)) or np.any(np.isinf(projected)):
                continue
            
            distances = np.sqrt(np.sum((projected - dst_pts) ** 2, axis=1))
            inliers = distances < threshold
            
            if np.sum(inliers) > len(max_inliers):
                max_inliers = inliers
                best_H = H
                
                if np.sum(inliers) > 0.8 * n_points:
                    break
        except:
            continue
    
    if np.sum(max_inliers) > 4:
        inlier_src = src_pts[max_inliers]
        inlier_dst = dst_pts[max_inliers]
        best_H = compute_homography(inlier_src, inlier_dst)
    
    return best_H, max_inliers

def load_ground_truth_homography():
    H_gt = np.loadtxt('graf/H1to5p')
    return H_gt

def compare_homographies(H_computed, H_gt):
    print("\n" + "="*60)
    print("HOMOGRAPHY COMPARISON")
    print("="*60)
    print("\nComputed Homography (RANSAC):")
    print(H_computed)
    print("\nGround Truth Homography:")
    print(H_gt)
    
    H_diff = np.abs(H_computed - H_gt)
    print("\nAbsolute Difference:")
    print(H_diff)
    
    frobenius_error = np.linalg.norm(H_diff, 'fro')
    print(f"\nFrobenius Norm of Difference: {frobenius_error:.6f}")
    
    relative_error = np.abs((H_computed - H_gt) / (H_gt + 1e-10)) * 100
    print("\nRelative Error (%):")
    print(relative_error)
    print("="*60 + "\n")

def stitch_images(img1, img5, H):
    h1, w1 = img1.shape[:2]
    h5, w5 = img5.shape[:2]
    
    corners_img1 = np.array([[0, 0, 1], [w1, 0, 1], [w1, h1, 1], [0, h1, 1]], dtype=np.float32).T
    transformed_corners = H @ corners_img1
    transformed_corners = transformed_corners / transformed_corners[2, :]
    
    all_corners = np.hstack([transformed_corners[:2, :], 
                              np.array([[0, w5, w5, 0], [0, 0, h5, h5]], dtype=np.float32)])
    
    [x_min, y_min] = np.int32(all_corners.min(axis=1))
    [x_max, y_max] = np.int32(all_corners.max(axis=1))
    
    translation = np.array([[1, 0, -x_min], [0, 1, -y_min], [0, 0, 1]])
    H_translated = translation @ H
    
    output_size = (x_max - x_min, y_max - y_min)
    warped_img1 = cv2.warpPerspective(img1, H_translated, output_size)
    
    stitched = warped_img1.copy()
    stitched[-y_min:-y_min+h5, -x_min:-x_min+w5] = img5
    
    return stitched, warped_img1

def main():
    print("Loading images...")
    img1, img5, img1_gray, img5_gray = load_images()
    
    print("Computing and matching SIFT features...")
    kp1, kp5, good_matches = compute_and_match_sift(img1_gray, img5_gray)
    print(f"Found {len(good_matches)} good matches")
    
    print("Visualizing matches...")
    visualize_matches(img1, img5, kp1, kp5, good_matches)
    
    print("Extracting matched points...")
    src_pts = np.float32([kp1[m.queryIdx].pt for m in good_matches])
    dst_pts = np.float32([kp5[m.trainIdx].pt for m in good_matches])
    
    print("Computing homography using RANSAC...")
    H_computed, inliers = ransac_homography(src_pts, dst_pts)
    print(f"Number of inliers: {np.sum(inliers)} out of {len(good_matches)}")
    
    print("Loading ground truth homography...")
    H_gt = load_ground_truth_homography()
    
    compare_homographies(H_computed, H_gt)
    
    print("Stitching images...")
    stitched, warped = stitch_images(img1, img5, H_computed)
    
    print("Saving results...")
    fig, axes = plt.subplots(2, 2, figsize=(16, 12))
    
    axes[0, 0].imshow(cv2.cvtColor(img1, cv2.COLOR_BGR2RGB))
    axes[0, 0].set_title('Source Image (img1.ppm)')
    axes[0, 0].axis('off')
    
    axes[0, 1].imshow(cv2.cvtColor(img5, cv2.COLOR_BGR2RGB))
    axes[0, 1].set_title('Target Image (img5.ppm)')
    axes[0, 1].axis('off')
    
    axes[1, 0].imshow(cv2.cvtColor(warped, cv2.COLOR_BGR2RGB))
    axes[1, 0].set_title('Warped Source Image')
    axes[1, 0].axis('off')
    
    axes[1, 1].imshow(cv2.cvtColor(stitched, cv2.COLOR_BGR2RGB))
    axes[1, 1].set_title('Final Stitched Image')
    axes[1, 1].axis('off')
    
    plt.tight_layout()
    plt.savefig('stitching_results.png', dpi=150, bbox_inches='tight')
    plt.close()
    
    cv2.imwrite('final_stitched.png', stitched)
    
    print("\nResults saved:")
    print("- sift_matches.png: SIFT feature matches")
    print("- stitching_results.png: Complete stitching pipeline")
    print("- final_stitched.png: Final stitched result")
    print("\nDone!")

if __name__ == "__main__":
    main()
