import os
import shutil

def clean_folder(folder_path):
    """
    清空指定資料夾（保留資料夾本身，刪除資料夾內所有檔案與子資料夾）
    """
    if not os.path.exists(folder_path):
        print(f"Folder does not exist: {folder_path}")
        return

    # 列出資料夾中的所有項目
    for entry in os.listdir(folder_path):
        full_path = os.path.join(folder_path, entry)
        # 如果是檔案或符號連結，直接刪除
        if os.path.isfile(full_path) or os.path.islink(full_path):
            os.unlink(full_path)
        # 如果是資料夾，使用 shutil.rmtree 進行遞迴刪除
        elif os.path.isdir(full_path):
            shutil.rmtree(full_path)

# 要清空的資料夾清單
folders_to_clean = [
    "pico",
    "svg_separate",
    "final_font"
]

# 逐一清空每個資料夾
for folder in folders_to_clean:
    print(f"Cleaning folder: {folder}")
    clean_folder(folder)
    print(f"Done cleaning: {folder}")

print("All specified folders have been cleaned!")
