import socket
import paramiko
import subprocess
import os

local_file_path = '/home/student/s3conds/Template'
remote_path = '/home/kali/concurs'

def execute_ssh_command(hostname, username, password, command):
    # Create SSH client object
    client = paramiko.SSHClient()
    
    try:
        # Automatically add the server's host key
        client.set_missing_host_key_policy(paramiko.AutoAddPolicy())
        
        # Connect to the SSH server
        client.connect(hostname, username=username, password=password)
        
        # Execute the command on the remote server
        stdin, stdout, stderr = client.exec_command(command)
        
        # Print the output of the command
        print(stdout.read().decode())
        
        # Close the SSH connection5
        client.close()
        print("SSH con5nection closed")
        
    except paramiko.AuthenticationException:
        print("Authentication failed. Please check your credentials.")
        
    except paramiko.SSHException as ssh_ex:
        print("Unable to establish SSH connection:", str(ssh_ex))
        
    except Exception as ex:
        print("An error occurred:", str(ex))
        
def ssh_exchange(hostname, username, password):
    # Create SSH client object
    client = paramiko.SSHClient()

    try:
        # Automatically add the server's host key
        client.set_missing_host_key_policy(paramiko.AutoAddPolicy())

        # Connect to the SSH server
        client.connect(hostname, username=username, password=password)

        # Create SFTP client
        sftp = client.open_sftp()

        # Iterate over files in the local directory
        for root, dirs, files in os.walk(local_file_path):
            # Create corresponding directories on the remote server
            for dir in dirs:
                local_dir = os.path.join(root, dir)
                remote_dir = os.path.join(remote_path, os.path.relpath(local_dir, local_file_path))
                sftp.mkdir(remote_dir)

            # Transfer files to the remote server
            for file in files:
                local_file = os.path.join(root, file)
                remote_file = os.path.join(remote_path, os.path.relpath(local_file, local_file_path))
                sftp.put(local_file, remote_file)

        # Close the SFTP connection
        sftp.close()

        # Close the SSH connection
        client.close()
        print("SSH connection closed")

    except paramiko.AuthenticationException:
        print("Authentication failed. Please check your credentials.")

    except paramiko.SSHException as ssh_ex:
        print("Unable to establish SSH connection:", str(ssh_ex))

    except Exception as ex:
        print("An error occurred:", str(ex))

def main():
    #cmd = f"sshpass -p kali scp -rp {local_file_path} kali@172.16.29.90:{remote_path}"
    #execute_ssh_command('172.16.29.90','kali', 'kali', cmd)
	ssh_exchange('172.16.29.90', 'kali', 'kali')

if __name__ == '__main__':
    main()