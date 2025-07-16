import os

def rename_unicode_files(folder):
    """
    將資料夾裡，以十進位 Unicode 數字作為檔名的檔案，
    重新命名成 u+十六進位 的形式。
    例如: 19968.txt -> u+4e00.txt
    """
    for filename in os.listdir(folder):
        # 僅處理特定副檔名 (例如 .txt)；可依需求改成其他格式，如 .png, .svg, .jpg 等
        if filename.lower().endswith(".png"):
            base_name = os.path.splitext(filename)[0]  # 去掉副檔名
            try:
                # 將十進位字串轉成 int，並用 format() 轉成十六進位字串
                code_val = int(base_name)
                hex_val = format(code_val, 'x')  # 例如 19968 -> '4e00'
                
                # 組合新的檔名：u+{hex_val}.txt
                new_filename = f"u+{hex_val}.png"
                
                old_path = os.path.join(folder, filename)
                new_path = os.path.join(folder, new_filename)
                
                # 執行重新命名
                os.rename(old_path, new_path)
                print(f"Renamed '{filename}' to '{new_filename}'")
            
            except ValueError:
                # 如果不是純數字或轉換失敗，則略過
                print(f"Skipping '{filename}' - not a valid decimal Unicode code.")
                continue

if __name__ == "__main__":
    # 指定要處理的資料夾路徑
    script_dir = os.path.dirname(os.path.abspath(__file__))
    workspace_dir = os.path.abspath(os.path.join(script_dir, os.pardir, "workspace"))
    folder_path = os.path.join(workspace_dir, "sourcePNG")
    # print("要處理的資料夾：", folder_path)
    rename_unicode_files(folder_path)
