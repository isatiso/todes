import { RedisQuery } from './redis-query'

const client = new RedisQuery({
    host: 'r-test001.redis.rds.aliyuncs.com',
    port: 6379,
    db: 67,
    auth_pass: 'lYoAwNg1VKyeOVV2Piyi7EZl0Z8w9Pe2'
})

client.on('p_error', err => console.log(' =-----------------------> p_error', err))

// const buf_arr: Buffer[] = []
//
// function push_buf(b64str: string) {
//     buf_arr.push(Buffer.from(b64str))
// }
// push_buf('+OK\r\n')
// push_buf('$3352\r\n# Server\r\nredis_version:5.0.5\r\nredis_git_sha1:49d0da0e\r\nredis_git_dirty:1\r\nredis')
// push_buf('_build_id:fd9e1066f2a2eeb5\r\nredis_mode:standalone\r\nos:Linux  \r')
// push_buf('\narch_bits:64\r\nmultiplexing_api:epoll\r\natomicvar_api:atomic-builtin\r\ngcc_version:0.0.0\r\nprocess_id:25891\r\nrun_id:e8e9d15af4f1cc384544d70dc81dfce1af62701e\r\ntcp_port:6379\r\nuptime_in_seconds:18089269\r\nuptime_in_days:209\r\nhz:10\r\nconfigured_hz:10\r\nlru_clock:14885969\r\nexecutable:\r\nconfig_file:\r\n\r\n# Clients\r\nconnected_clients:21\r\nclient_recent_max_input_buffer:2\r\nclient_recent_max_output_buffer:0\r\nblocked_clients:0\r\n\r\n# Memory\r\nused_memory:7296344\r\nused_memory_human:6.96M\r\nused_memory_rss:8495104\r\nused_memory_rss_human:8.10M\r\nused_memory_peak:19832640\r\nused_memory_peak_human:18.91M\r\nused_memory_peak_perc:36.79%\r\nused_memory_overhead:5449302\r\nused_memory_startup:4995776\r\nused_memory_dataset:1847042\r\nused_memory_dataset_perc:80.29%\r\nallocator_allocated:7784544\r\nallocator_active:8548352\r\nallocator_resident:22343680\r\nused_memory_lua:37888\r\nused_memory_lua_human:37.00K\r\nused_memory_scripts:0\r\nused_memory_scripts_human:0B\r\nnumber_of_cached_scripts:0\r\nmaxmemory:1073741824\r\nmaxmemory_human:1.00G\r\nmaxmemory_policy:volatile-lru\r\nallocator_frag_ratio:1.10\r\nallocator_frag_bytes:763808\r\nallocator_rss_ratio:2.61\r\nallocator_rss_bytes:13795328\r\nrss_overhead_ratio:0.38\r\nrss_overhead_bytes:-13848576\r\nmem_fragmentation_ratio:1.17\r\nmem_fragmentation_bytes:1261560\r\nmem_not_counted_for_evict:1354\r\nmem_replication_backlog:0\r\nmem_clients_slaves:0\r\nmem_clients_normal:441588\r\nmem_aof_buffer:1354\r\nmem_allocator:jemalloc-5.1.0\r\nactive_defrag_running:0\r\nlazyfree_pending_objects:0\r\noom_err_count:0\r\n\r\n# Stats\r\ntotal_connections_received:10889354\r\ntotal_commands_processed:270580431\r\ninstantaneous_ops_per_sec:10\r\ntotal_net_input_bytes:9690915909\r\ntotal_net_output_bytes:75564720433\r\ninstantaneous_input_kbps:0.37\r\ninstantaneous_output_kbps:13.09\r\nrejected_connections:0\r\nrejected_connections_status:0\r\nsync_full:0\r\nsync_partial_ok:0\r\nsync_partial_err:0\r\nexpired_keys:48084\r\nexpired_stale_perc:0.00\r\nexpired_time_cap_reached_count:0\r\nevicted_keys:0\r\nevicted_keys_per_sec:0\r\nkeyspace_hits:1837238\r\nkeyspace_misses:139352\r\nhits_per_sec:0\r\nmisses_per_sec:0\r\nhit_rate_percentage:0.00\r\npubsub_channels:0\r\npubsub_patterns:0\r\nlatest_fork_usec:609\r\nmigrate_cached_sockets:0\r\nslave_expires_tracked_keys:0\r\nactive_defrag_hits:0\r\nactive_defrag_misses:0\r\nactive_defrag_key_hits:0\r\nactive_defrag_key_misses:0\r\ntraffic_control_input:0\r\ntraffic_control_input_status:0\r\ntraffic_control_output:0\r\ntraffic_control_output_status:0\r\nstat_avg_rt:48\r\nstat_max_rt:1134\r\npacluster_migrate_sum_rt:0\r\npacluster_migrate_max_rt:0\r\npacluster_migrate_qps:0\r\npacluster_import_sum_rt:0\r\npacluster_import_max_rt:0\r\npacluster_import_qps:0\r\npacluster_migrate_start_time:0\r\npacluster_importing_start_time:0\r\nslot_psync_ok:0\r\nslot_psync_err:0\r\n\r\n# CPU\r\nused_cpu_sys:19371.367342\r\nused_cpu_user:41099.908190\r\nused_cpu_sys_children:0.400033\r\nused_cpu_user_children:0.184346\r\n\r\n# Cluster\r\ncluster_enabled:0\r\ndatabases:256\r\nnodecount:1\r\n\r\n# paCluster\r\npacluster_enabled:0\r\n\r\n# Keyspace\r\ndb0:keys=20,expires=20,avg_ttl=3245127\r\ndb1:keys=4,expires=4,avg_ttl=476991373\r\ndb2:keys=34,expires=34,avg_ttl=1425513546\r\ndb67:keys=1,expires=0,avg_ttl=0\r\ndb249:keys=17,expires=17,avg_ttl=669013643\r\ndb252:keys=13,expires=13,avg_ttl=1112963\r\ndb254:keys=19,expires=0,avg_ttl=0\r\n\r\n')
// push_buf('+OK\r\n+PONG\r\n')
// push_buf('+OK\r\n')
// push_buf(':4\r\n')
// push_buf('*8\r\n$1\r\na\r\n$1\r\n2\r\n$1\r\nb\r\n$1\r\n5\r\n$1\r\nv\r\n$1\r\n6\r\n$1\r\ni\r\n$2\r\n88\r\n')
// push_buf('*206\r\n*6\r\n$9\r\nsismember\r\n:3\r\n*2\r\n+readonly\r\n+fast\r\n:1\r\n:1\r')
// push_buf('\n:1\r\n*6\r\n$5\r\nlpush\r\n:-3\r\n*3\r\n+write\r\n+denyoom\r\n+fast\r\n')
// push_buf(':1\r\n:1\r\n:1\r\n*6\r\n$6\r\nlrange\r\n:4\r\n*1\r\n+readonly\r\n:1\r\n:1\r\n:1\r\n*6\r\n$5\r\nhkeys\r\n:2\r\n')
// push_buf('*2\r\n+readonly\r\n+sort_for_script\r\n:1\r\n:1\r\n:1\r\n*6\r\n$6\r\nstrlen\r\n:2\r\n*2\r\n+readonly\r\n+fast\r\n:')
// push_buf('1\r\n:1\r\n:1\r\n*6\r\n$5\r\nsmove\r\n:4\r\n*2\r\n+write\r\n+fast\r\n:1\r\n:2\r\n:1\r\n*6\r\n$6\r\nsetbit\r\n:4\r\n*2\r\n+write\r\n+den')
// push_buf('yoom\r\n:1\r\n:1\r\n:1\r\n*6\r\n$4\r\necho\r\n:2\r\n*1\r\n+fast\r\n:0\r\n:0\r\n:0\r\n*6\r\n$4\r\nrole\r\n:1\r\n*3\r\n+noscript\r\n+loading\r\n+stale\r\n:0\r\n:0\r\n:0\r\n*6\r\n$3\r\ndel\r\n:-2\r\n*1\r\n+write\r\n:1\r\n:-1\r\n:1\r\n*6\r\n$4\r\nauth\r\n:2\r\n*4\r\n+noscript\r\n+loading\r\n+stale\r\n+fast\r\n:0\r\n:0\r\n:0\r\n*6\r\n$9\r\nreplicaof\r\n:3\r\n*3\r\n+admin\r\n+noscript\r\n+stale\r\n:0\r\n:0\r\n:0\r\n*6\r\n$15\r\nforcefullresync\r\n:-1\r\n*3\r\n+readonly\r\n+admin\r\n+noscript\r\n:0\r\n:0\r\n:0\r\n*6\r\n$11\r\nbitfield_ro\r\n:-2\r\n*1\r\n+readonly\r\n:1\r\n:1\r\n:1\r\n*6\r\n$5\r\nsdiff\r\n:-2\r\n*2\r\n+readonly\r\n+sort_for_script\r\n:1\r\n:-1\r\n:1\r\n*6\r\n$6\r\nrpushx\r\n:-3\r\n*3\r\n+write\r\n+denyoom\r\n+fast\r\n:1\r\n:1\r\n:1\r\n*6\r\n$7\r\nzpopmin\r\n:-2\r\n*2\r\n+write\r\n+fast\r\n:1\r\n:1\r\n:1\r\n*6\r\n$4\r\nscan\r\n:-2\r\n*2\r\n+readonly\r\n+random\r\n:0\r\n:0\r\n:0\r\n*6\r\n$4\r\nhget\r\n:3\r\n*2\r\n+readonly\r\n+fast\r\n:1\r\n:1\r\n:1\r\n*6\r\n$5\r\nxinfo\r\n:-2\r\n*2\r\n+readonly\r\n+random\r\n:2\r\n:2\r\n:1\r\n*6\r\n$4\r\nxlen\r\n:2\r\n*2\r\n+readonly\r\n+fast\r\n:1\r\n:1\r\n:1\r\n*6\r\n$4\r\nmset\r\n:-3\r\n*2\r\n+write\r\n+denyoom\r\n:1\r\n:-1\r\n:2\r\n*6\r\n$8\r\nsmembers\r\n:2\r\n*2\r\n+readonly\r\n+sort_for_script\r\n:1\r\n:1\r\n:1\r\n*6\r\n$5\r\nscard\r\n:2\r\n*2\r\n+readonly\r\n+fast\r\n:1\r\n:1\r\n:1\r\n*6\r\n$4\r\nexec\r\n:1\r\n*2\r\n+noscript\r\n+skip_monitor\r\n:0\r\n:0\r\n:0\r\n*6\r\n$6\r\nhklist\r\n:-1\r\n*5\r\n+readonly\r\n+noscript\r\n+loading\r\n+stale\r\n+skip_monitor\r\n:0\r\n:0\r\n:0\r\n*6\r\n$7\r\ndiscard\r\n:1\r\n*2\r\n+noscript\r\n+fast\r\n:0\r\n:0\r\n:0\r\n*6\r\n$7\r\nrestore\r\n:-4\r\n*2\r\n+write\r\n+denyoom\r\n:1\r\n:1\r\n:1\r\n*6\r\n$11\r\nsrandmember\r\n:-2\r\n*2\r\n+readonly\r\n+random\r\n:1\r\n:1\r\n:1\r\n*6\r\n$4\r\nzrem\r\n:-3\r\n*2\r\n+write\r\n+fast\r\n:1\r\n:1\r\n:1\r\n*6\r\n$11\r\nsinterstore\r\n:-3\r\n*2\r\n+write\r\n+denyoom\r\n:1\r\n:-1\r\n:1\r\n*6\r\n$7\r\nhincrby\r\n:4\r\n*3\r\n+write\r\n+denyoom\r\n+fast\r\n:1\r\n:1\r\n:1\r\n*6\r\n$5\r\nsscan\r\n:-3\r\n*2\r\n+readonly\r\n+random\r\n:1\r\n:1\r\n:1\r\n*6\r\n$7\r\nmigrate\r\n:-6\r\n*2\r\n+write\r\n+movablekeys\r\n:0\r\n:0\r\n:0\r\n*6\r\n$9\r\nxrevrange\r\n:-4\r\n*1\r\n+readonly\r\n:1\r\n:1\r\n:1\r\n*6\r\n$16\r\nzremrangebyscore\r\n:4\r\n*1\r\n+write\r\n:1\r\n:1\r\n:1\r\n*6\r\n$10\r\npfselftest\r\n:1\r\n*1\r\n+admin\r\n:0\r\n:0\r\n:0\r\n*6\r\n$4\r\ninfo\r\n:-1\r\n*2\r\n+loading\r\n+stale\r\n:0\r\n:0\r\n:0\r\n*6\r\n$4\r\ntime\r\n:1\r\n*2\r\n+random\r\n+fast\r\n:0\r\n:0\r\n:0\r\n*6\r\n$5\r\nhvals\r\n:2\r\n*2\r\n+readonly\r\n+sort_for_script\r\n:1\r\n:1\r\n:1\r\n*6\r\n$6\r\nscript\r\n:-2\r\n*2\r\n+write\r\n+noscript\r\n:0\r\n:0\r\n:0\r\n*6\r\n$6\r\ndecrby\r\n:3\r\n*3\r\n+write\r\n+denyoom\r\n+fast\r\n:1\r\n:1\r\n:1\r\n*6\r\n$6\r\nselect\r\n:2\r\n*2\r\n+loading\r\n+fast\r\n:0\r\n:0\r\n:0\r\n*6\r\n$5\r\nxread\r\n:-4\r\n*3\r\n+readonly\r\n+noscript\r\n+movablekeys\r\n:1\r\n:1\r\n:1\r\n*6\r\n$5\r\nzcard\r\n:2\r\n*2\r\n+readonly\r\n+fast\r\n:1\r\n:1\r\n:1\r\n*6\r\n$4\r\ntype\r\n:2\r\n*2\r\n+readonly\r\n+fast\r\n:1\r\n:1\r\n:1\r\n*6\r\n$6\r\ngeopos\r\n:-2\r\n*1\r\n+readonly\r\n:1\r\n:1\r\n:1\r\n*6\r\n$5\r\ntouch\r\n:-2\r\n*2\r\n+readonly\r\n+fast\r\n:1\r\n:1\r\n:1\r\n*6\r\n$7\r\nslowlog\r\n:-2\r\n*1\r\n+admin\r\n:0\r\n:0\r\n:0\r\n*6\r\n$4\r\npttl\r\n:2\r\n*2\r\n+readonly\r\n+fast\r\n:1\r\n:1\r\n:1\r\n*6\r\n$10\r\nxreadgroup\r\n:-7\r\n*3\r\n+write\r\n+noscript\r\n+movablekeys\r\n:1\r\n:1\r\n:1\r\n*6\r\n$6\r\nmodule\r\n:-2\r\n*2\r\n+admin\r\n+noscript\r\n:1\r\n:1\r\n:1\r\n*6\r\n$7\r\ncommand\r\n:0\r\n*2\r\n+loading\r\n+stale\r\n:0\r\n:0\r\n:0\r\n*6\r\n$5\r\nhscan\r\n:-3\r\n*2\r\n+readonly\r\n+random\r\n:1\r\n:1\r\n:1\r\n*6\r\n$8\r\nsetrange\r\n:4\r\n*2\r\n+write\r\n+denyoom\r\n:1\r\n:1\r\n:1\r\n*6\r\n$6\r\nasking\r\n:1\r\n*1\r\n+fast\r\n:0\r\n:0\r\n:0\r\n*6\r\n$9\r\nsubscribe\r\n:-2\r\n*4\r\n+pubsub\r\n+noscript\r\n+loading\r\n+stale\r\n:0\r\n:0\r\n:0\r\n*6\r\n$4\r\nxadd\r\n:-5\r\n*4\r\n+write\r\n+denyoom\r\n+random\r\n+fast\r\n:1\r\n:1\r\n:1\r\n*6\r\n$9\r\ngeoradius\r\n:-6\r\n*2\r\n+write\r\n+movablekeys\r\n:1\r\n:1\r\n:1\r\n*6\r\n$6\r\nzscore\r\n:3\r\n*2\r\n+readonly\r\n+fast\r\n:1\r\n:1\r\n:1\r\n*6\r\n$4\r\ndump\r\n:2\r\n*1\r\n+readonly\r\n:1\r\n:1\r\n:1\r\n*6\r\n$4\r\nhlen\r\n:2\r\n*2\r\n+readonly\r\n+fast\r\n:1\r\n:1\r\n:1\r\n*6\r\n$7\r\ngeohash\r\n:-2\r\n*1\r\n+readonly\r\n:1\r\n:1\r\n:1\r\n*6\r\n$5\r\nsetnx\r\n:3\r\n*3\r\n+write\r\n+denyoom\r\n+fast\r\n:1\r\n:1\r\n:1\r\n*6\r\n$7\r\npfdebug\r\n:-3\r\n*1\r\n+write\r\n:0\r\n:0\r\n:0\r\n*6\r\n$4\r\nxdel\r\n:-3\r\n*2\r\n+write\r\n+fast\r\n:1\r\n:1\r\n:1\r\n*6\r\n$8\r\nsentinel\r\n:-2\r\n*1\r\n+noscript\r\n:0\r\n:0\r\n:0\r\n*6\r\n$8\r\nxpending\r\n:-3\r\n*2\r\n+readonly\r\n+random\r\n:1\r\n:1\r\n:1\r\n*6\r\n$4\r\nincr\r\n:2\r\n*3\r\n+write\r\n+denyoom\r\n+fast\r\n:1\r\n:1\r\n:1\r\n*6\r\n$6\r\nhsetnx\r\n:4\r\n*3\r\n+write\r\n+denyoom\r\n+fast\r\n:1\r\n:1\r\n:1\r\n*6\r\n$5\r\nmulti\r\n:1\r\n*2\r\n+noscript\r\n+fast\r\n:0\r\n:0\r\n:0\r\n*6\r\n$4\r\nllen\r\n:2\r\n*2\r\n+readonly\r\n+fast\r\n:1\r\n:1\r\n:1\r\n*6\r\n$12\r\nbgrewriteaof\r\n:1\r\n*1\r\n+admin\r\n:0\r\n:0\r\n:0\r\n*6\r\n$6\r\nbgsave\r\n:-1\r\n*1\r\n+admin\r\n:0\r\n:0\r\n:0\r\n*6\r\n$17\r\ngeoradiusbymember\r\n:-5\r\n*2\r\n+write\r\n+movablekeys\r\n:1\r\n:1\r\n:1\r\n*6\r\n$8\r\nlastsave\r\n:1\r\n*2\r\n+random\r\n+fast\r\n:0\r\n:0\r\n:0\r\n*6\r\n$7\r\nflushdb\r\n:-1\r\n*1\r\n+write\r\n:0\r\n:0\r\n:0\r\n*6\r\n$4\r\nlrem\r\n:4\r\n*1\r\n+write\r\n:1\r\n:1\r\n:1\r\n*6\r\n$6\r\nexists\r\n:-2\r\n*2\r\n+readonly\r\n+fast\r\n:1\r\n:-1\r\n:1\r\n*6\r\n$7\r\nslaveof\r\n:3\r\n*3\r\n+admin\r\n+noscript\r\n+stale\r\n:0\r\n:0\r\n:0\r\n*6\r\n$7\r\nmonitor\r\n:1\r\n*2\r\n+admin\r\n+noscript\r\n:0\r\n:0\r\n:0\r\n*6\r\n$6\r\nbitpos\r\n:-3\r\n*1\r\n+readonly\r\n:1\r\n:1\r\n:1\r\n*6\r\n$4\r\nsort\r\n:-2\r\n*3\r\n+write\r\n+denyoom\r\n+movablekeys\r\n:1\r\n:1\r\n:1\r\n*6\r\n$11\r\nzunionstore\r\n:-4\r\n*3\r\n+write\r\n+denyoom\r\n+movablekeys\r\n:0\r\n:0\r\n:0\r\n*6\r\n$5\r\nblpop\r\n:-3\r\n*2\r\n+write\r\n+noscript\r\n:1\r\n:-2\r\n:1\r\n*6\r\n$5\r\nbitop\r\n:-4\r\n*2\r\n+write\r\n+denyoom\r\n:2\r\n:-1\r\n:1\r\n*6\r\n$9\r\nreadwrite\r\n:1\r\n*1\r\n+fast\r\n:0\r\n:0\r\n:0\r\n*6\r\n$9\r\npexpireat\r\n:3\r\n*2\r\n+write\r\n+fast\r\n:1\r\n:1\r\n:1\r\n*6\r\n$9\r\nzlexcount\r\n:4\r\n*2\r\n+readonly\r\n+fast\r\n:1\r\n:1\r\n:1\r\n*6\r\n$8\r\nbzpopmin\r\n:-3\r\n*3\r\n+write\r\n+noscript\r\n+fast\r\n:1\r\n:-2\r\n:1\r\n*6\r\n$6\r\nsinter\r\n:-2\r\n*2\r\n+readonly\r\n+sort_for_script\r\n:1\r\n:-1\r\n:1\r\n*6\r\n$5\r\nzscan\r\n:-3\r\n*2\r\n+readonly\r\n+random\r\n:1\r\n:1\r\n:1\r\n*6\r\n$8\r\nbzpopmax\r\n:-3\r\n*3\r\n+write\r\n+noscript\r\n+fast\r\n:1\r\n:-2\r\n:1\r\n*6\r\n$4\r\nxack\r\n:-4\r\n*2\r\n+write\r\n+fast\r\n:1\r\n:1\r\n:1\r\n*6\r\n$12\r\npunsubscribe\r\n:-1\r\n*4\r\n+pubsub\r\n+noscript\r\n+loading\r\n+stale\r\n:0\r\n:0\r\n:0\r\n*6\r\n$4\r\npost\r\n:-1\r\n*2\r\n+loading\r\n+stale\r\n:0\r\n:0\r\n:0\r\n*6\r\n$11\r\nzrangebylex\r\n:-4\r\n*1\r\n+readonly\r\n:1\r\n:1\r\n:1\r\n*6\r\n$8\r\nbitcount\r\n:-2\r\n*1\r\n+readonly\r\n:1\r\n:1\r\n:1\r\n*6\r\n$4\r\nspop\r\n:-2\r\n*3\r\n+write\r\n+random\r\n+fast\r\n:1\r\n:1\r\n:1\r\n*6\r\n$5\r\nltrim\r\n:4\r\n*1\r\n+write\r\n:1\r\n:1\r\n:1\r\n*6\r\n$3\r\nttl\r\n:2\r\n*2\r\n+readonly\r\n+fast\r\n:1\r\n:1\r\n:1\r\n*6\r\n$4\r\nkeys\r\n:2\r\n*2\r\n+readonly\r\n+sort_for_script\r\n:0\r\n:0\r\n:0\r\n*6\r\n$4\r\nsave\r\n:1\r\n*2\r\n+admin\r\n+noscript\r\n:0\r\n:0\r\n:0\r\n*6\r\n$6\r\nunlink\r\n:-2\r\n*2\r\n+write\r\n+fast\r\n:1\r\n:-1\r\n:1\r\n*6\r\n$7\r\ngeodist\r\n:-4\r\n*1\r\n+readonly\r\n:1\r\n:1\r\n:1\r\n*6\r\n$4\r\nmove\r\n:3\r\n*2\r\n+write\r\n+fast\r\n:1\r\n:1\r\n:1\r\n*6\r\n$4\r\neval\r\n:-3\r\n*3\r\n+write\r\n+noscript\r\n+movablekeys\r\n:0\r\n:0\r\n:0\r\n*6\r\n$11\r\nincrbyfloat\r\n:3\r\n*3\r\n+write\r\n+denyoom\r\n+fast\r\n:1\r\n:1\r\n:1\r\n*6\r\n$9\r\nrpoplpush\r\n:3\r\n*2\r\n+write\r\n+denyoom\r\n:1\r\n:2\r\n:1\r\n*6\r\n$7\r\nevalsha\r\n:-3\r\n*3\r\n+write\r\n+noscript\r\n+movablekeys\r\n:0\r\n:0\r\n:0\r\n*6\r\n$8\r\nzrevrank\r\n:3\r\n*2\r\n+readonly\r\n+fast\r\n:1\r\n:1\r\n:1\r\n*6\r\n$13\r\nzrangebyscore\r\n:-4\r\n*1\r\n+readonly\r\n:1\r\n:1\r\n:1\r\n*6\r\n$3\r\nset\r\n:-3\r\n*2\r\n+write\r\n+denyoom\r\n:1\r\n:1\r\n:1\r\n*6\r\n$5\r\nbrpop\r\n:-3\r\n*2\r\n+write\r\n+noscript\r\n:1\r\n:-2\r\n:1\r\n*6\r\n$6\r\npubsub\r\n:-2\r\n*4\r\n+pubsub\r\n+random\r\n+loading\r\n+stale\r\n:0\r\n:0\r\n:0\r\n*6\r\n$9\r\nrandomkey\r\n:1\r\n*2\r\n+readonly\r\n+random\r\n:0\r\n:0\r\n:0\r\n*6\r\n$4\r\nsadd\r\n:-3\r\n*3\r\n+write\r\n+denyoom\r\n+fast\r\n:1\r\n:1\r\n:1\r\n*6\r\n$7\r\npfmerge\r\n:-2\r\n*2\r\n+write\r\n+denyoom\r\n:1\r\n:-1\r\n:1\r\n*6\r\n$4\r\nlpop\r\n:2\r\n*2\r\n+write\r\n+fast\r\n:1\r\n:1\r\n:1\r\n*6\r\n$6\r\nmsetnx\r\n:-3\r\n*2\r\n+write\r\n+denyoom\r\n:1\r\n:-1\r\n:2\r\n*6\r\n$7\r\npexpire\r\n:3\r\n*2\r\n+write\r\n+fast\r\n:1\r\n:1\r\n:1\r\n*6\r\n$7\r\npersist\r\n:2\r\n*2\r\n+write\r\n+fast\r\n:1\r\n:1\r\n:1\r\n*6\r\n$6\r\nexpire\r\n:3\r\n*2\r\n+write\r\n+fast\r\n:1\r\n:1\r\n:1\r\n*6\r\n$9\r\nzrevrange\r\n:-4\r\n*1\r\n+readonly\r\n:1\r\n:1\r\n:1\r\n*6\r\n$6\r\ndbsize\r\n:1\r\n*2\r\n+readonly\r\n+fast\r\n:0\r\n:0\r\n:0\r\n*6\r\n$7\r\nzincrby\r\n:4\r\n*3\r\n+write\r\n+denyoom\r\n+fast\r\n:1\r\n:1\r\n:1\r\n*6\r\n$6\r\nsunion\r\n:-2\r\n*2\r\n+readonly\r\n+sort_for_script\r\n:1\r\n:-1\r\n:1\r\n*6\r\n$4\r\nsync\r\n:1\r\n*3\r\n+readonly\r\n+admin\r\n+noscript\r\n:0\r\n:0\r\n:0\r\n*6\r\n$4\r\nhdel\r\n:-3\r\n*2\r\n+write\r\n+fast\r\n:1\r\n:1\r\n:1\r\n*6\r\n$6\r\nxclaim\r\n:-6\r\n*3\r\n+write\r\n+random\r\n+fast\r\n:1\r\n:1\r\n:1\r\n*6\r\n$6\r\nsubstr\r\n:4\r\n*1\r\n+readonly\r\n:1\r\n:1\r\n:1\r\n*6\r\n$5\r\nsetex\r\n:4\r\n')
// push_buf('*2\r\n+write\r\n+denyoom\r\n:1\r\n:1\r\n:1\r\n*6\r\n$6\r\nlindex')
// push_buf('\r\n:3\r\n*1\r\n+readonly\r\n:1\r\n:1\r\n:1\r\n*6\r\n$4\r\nrpop\r\n:2\r\n*2\r\n+write\r\n+fast\r\n:1\r\n:1\r\n:1\r\n*6\r\n$4\r\nmget\r')
// push_buf('\n:-2\r\n*2\r\n+readonly\r\n+fast\r\n:1\r\n:-1\r\n:1\r\n*6\r\n$7\r\nlinsert\r\n:5\r\n*2\r\n+write\r\n+denyoom\r\n:1')
// push_buf('\r\n:1\r\n:1\r\n*6\r\n$6\r\nconfig\r\n:-2\r\n*3\r\n+admin\r\n+loading\r\n+stale\r\n:0\r\n:0\r\n:0\r\n*6\r\n$12')
// push_buf('\r\ngeoradius_ro\r\n:-6\r\n*2\r\n+readonly\r\n+movablekeys\r\n:1\r\n:1\r\n:1\r\n')
// push_buf('*6\r\n$4\r\nzadd\r\n:-4\r\n*3\r\n+write\r\n+denyoom\r\n+fast\r\n:1\r\n:1\r\n:1\r\n*6\r')
// push_buf('\n$11\r\nsunionstore\r\n:-3\r\n*2\r\n+write\r\n+denyoom\r\n:1\r\n:-1\r\n:1\r\n*6\r\n$6\r\nlpushx\r\n:-3\r\n*3\r\n+write\r\n+denyoom\r\n+fast\r\n:1\r\n:1\r\n:1\r\n*6\r\n$7\r\nzpopmax\r\n:-2\r\n*2\r\n+write\r\n+fast\r\n:1\r\n:1\r\n:1\r\n*6\r\n$7\r\nunwatch\r\n:1\r\n*2\r\n+noscript\r\n+fast\r\n:0\r\n:0\r\n:0\r\n*6\r\n$6\r\nzcount\r\n:4\r\n*2\r\n+readonly\r\n+fast\r\n:1\r\n:1\r\n:1\r\n*6\r\n$5\r\npfadd\r\n:-2\r\n*3\r\n+write\r\n+denyoom\r\n+fast\r\n:1\r\n:1\r\n:1\r\n*6\r\n$16\r\nzrevrangebyscore\r\n:-4\r\n*1\r\n+readonly\r\n:1\r\n:1\r\n:1\r\n*6\r\n$6\r\nlolwut\r\n:-1\r\n*1\r\n+readonly\r\n:0\r\n:0\r\n:0\r\n*6\r\n$6\r\nrename\r\n:3\r\n*1\r\n+write\r\n:1\r\n:2\r\n:1\r\n*6\r\n$4\r\nsrem\r\n:-3\r\n*2\r\n+write\r\n+fast\r\n:1\r\n:1\r\n:1\r\n*6\r\n$6\r\nobject\r\n:-2\r\n*1\r\n+readonly\r\n:2\r\n:2\r\n:2\r\n*6\r\n$4\r\ndecr\r\n:2\r\n*3\r\n+write\r\n+denyoom\r\n+fast\r\n:1\r\n:1\r\n:1\r\n*6\r\n$8\r\nbitfield\r\n:-2\r\n*2\r\n+write\r\n+denyoom\r\n:1\r\n:1\r\n:1\r\n*6\r\n$7\r\ncluster\r\n:-2\r\n*1\r\n+admin\r\n:0\r\n:0\r\n:0\r\n*6\r\n$6\r\nswapdb\r\n:3\r\n*2\r\n+write\r\n+fast\r\n:0\r\n:0\r\n:0\r\n*6\r\n$12\r\nhincrbyfloat\r\n:4\r\n*3\r\n+write\r\n+denyoom\r\n+fast\r\n:1\r\n:1\r\n:1\r\n*6\r\n$7\r\nhstrlen\r\n:3\r\n*2\r\n+readonly\r\n+fast\r\n:1\r\n:1\r\n:1\r\n*6\r\n$10\r\nbrpoplpush\r\n:4\r\n*3\r\n+write\r\n+denyoom\r\n+noscript\r\n:1\r\n:2\r\n:1\r\n*6\r\n$6\r\nzrange\r\n:-4\r\n*1\r\n+readonly\r\n:1\r\n:1\r\n:1\r\n*6\r\n$8\r\nhkswitch\r\n:-2\r\n*4\r\n+readonly\r\n+noscript\r\n+skip_monitor\r\n+fast\r\n:0\r\n:0\r\n:0\r\n*6\r\n$4\r\nlset\r\n:4\r\n*2\r\n+write\r\n+denyoom\r\n:1\r\n:1\r\n:1\r\n*6\r\n$5\r\nxtrim\r\n:-2\r\n*3\r\n+write\r\n+random\r\n+fast\r\n:1\r\n:1\r\n:1\r\n*6\r\n$9\r\nhkcounter\r\n:-2\r\n*4\r\n+readonly\r\n+noscript\r\n+skip_monitor\r\n+fast\r\n:0\r\n:0\r\n:0\r\n*6\r\n$6\r\nxsetid\r\n:3\r\n*3\r\n+write\r\n+denyoom\r\n+fast\r\n:1\r\n:1\r\n:1\r\n*6\r\n$15\r\nzremrangebyrank\r\n:4\r\n*1\r\n+write\r\n:1\r\n:1\r\n:1\r\n*6\r\n$6\r\nxgroup\r\n:-2\r\n*2\r\n+write\r\n+denyoom\r\n:2\r\n:2\r\n:1\r\n*6\r\n$8\r\nreadonly\r\n:1\r\n*1\r\n+fast\r\n:0\r\n:0\r\n:0\r\n*6\r\n$11\r\nunsubscribe\r\n:-1\r\n*4\r\n+pubsub\r\n+noscript\r\n+loading\r\n+stale\r\n:0\r\n:0\r\n:0\r\n*6\r\n$5\r\nzrank\r\n:3\r\n*2\r\n+readonly\r\n+fast\r\n:1\r\n:1\r\n:1\r\n*6\r\n$5\r\nrpush\r\n:-3\r\n*3\r\n+write\r\n+denyoom\r\n+fast\r\n:1\r\n:1\r\n:1\r\n*6\r\n$20\r\ngeoradiusbymember_ro\r\n:-5\r\n*2\r\n+readonly\r\n+movablekeys\r\n:1\r\n:1\r\n:1\r\n*6\r\n$8\r\ngetrange\r\n:4\r\n*1\r\n+readonly\r\n:1\r\n:1\r\n:1\r\n*6\r\n$3\r\nget\r\n:2\r\n*2\r\n+readonly\r\n+fast\r\n:1\r\n:1\r\n:1\r\n*6\r\n$8\r\nshutdown\r\n:-1\r\n*3\r\n+admin\r\n+loading\r\n+stale\r\n:0\r\n:0\r\n:0\r\n*6\r\n$6\r\nmemory\r\n:-2\r\n*1\r\n+readonly\r\n:0\r\n:0\r\n:0\r\n*6\r\n$14\r\nrestore-asking\r\n:-4\r\n*3\r\n+write\r\n+denyoom\r\n+asking\r\n:1\r\n:1\r\n:1\r\n*6\r\n$5\r\nhmget\r\n:-3\r\n*2\r\n+readonly\r\n+fast\r\n:1\r\n:1\r\n:1\r\n*6\r\n$5\r\npsync\r\n:3\r\n*3\r\n+readonly\r\n+admin\r\n+noscript\r\n:0\r\n:0\r\n:0\r\n*6\r\n$8\r\nflushall\r\n:-1\r\n*1\r\n+write\r\n:0\r\n:0\r\n:0\r\n*6\r\n$5\r\nwatch\r\n:-2\r\n*2\r\n+noscript\r\n+fast\r\n:1\r\n:-1\r\n:1\r\n*6\r\n$4\r\nping\r\n:-1\r\n*2\r\n+stale\r\n+fast\r\n:0\r\n:0\r\n:0\r\n*6\r\n$11\r\nzinterstore\r\n:-4\r\n*3\r\n+write\r\n+denyoom\r\n+movablekeys\r\n:0\r\n:0\r\n:0\r\n*6\r\n$6\r\nappend\r\n:3\r\n*2\r\n+write\r\n+denyoom\r\n:1\r\n:1\r\n:1\r\n*6\r\n$8\r\nexpireat\r\n:3\r\n*2\r\n+write\r\n+fast\r\n:1\r\n:1\r\n:1\r\n*6\r\n$6\r\npsetex\r\n:4\r\n*2\r\n+write\r\n+denyoom\r\n:1\r\n:1\r\n:1\r\n*6\r\n$10\r\nsdiffstore\r\n:-3\r\n*2\r\n+write\r\n+denyoom\r\n:1\r\n:-1\r\n:1\r\n*6\r\n$6\r\ngeoadd\r\n:-5\r\n*2\r\n+write\r\n+denyoom\r\n:1\r\n:1\r\n:1\r\n*6\r\n$6\r\nclient\r\n:-2\r\n*2\r\n+admin\r\n+noscript\r\n:0\r\n:0\r\n:0\r\n*6\r\n$8\r\nreplconf\r\n:-1\r\n*4\r\n+admin\r\n+noscript\r\n+loading\r\n+stale\r\n:0\r\n:0\r\n:0\r\n*6\r\n$7\r\nhexists\r\n:3\r\n*2\r\n+readonly\r\n+fast\r\n:1\r\n:1\r\n:1\r\n*6\r\n$4\r\nwait\r\n:3\r\n*1\r\n+noscript\r\n:0\r\n:0\r\n:0\r\n*6\r\n$14\r\nzrevrangebylex\r\n:-4\r\n*1\r\n+readonly\r\n:1\r\n:1\r\n:1\r\n*6\r\n$6\r\ngetset\r\n:3\r\n*2\r\n+write\r\n+denyoom\r\n:1\r\n:1\r\n:1\r\n*6\r\n$5\r\nhost:\r\n:-1\r\n*2\r\n+loading\r\n+stale\r\n:0\r\n:0\r\n:0\r\n*6\r\n$6\r\ngetbit\r\n:3\r\n*2\r\n+readonly\r\n+fast\r\n:1\r\n:1\r\n:1\r\n*6\r\n$8\r\nrenamenx\r\n:3\r\n*2\r\n+write\r\n+fast\r\n:1\r\n:2\r\n:1\r\n*6\r\n$10\r\npsubscribe\r\n:-2\r\n*4\r\n+pubsub\r\n+noscript\r\n+loading\r\n+stale\r\n:0\r\n:0\r\n:0\r\n*6\r\n$7\r\nhgetall\r\n:2\r\n*1\r\n+readonly\r\n:1\r\n:1\r\n:1\r\n*6\r\n$4\r\nhset\r\n:-4\r\n*3\r\n+write\r\n+denyoom\r\n+fast\r\n:1\r\n:1\r\n:1\r\n*6\r\n$5\r\ndebug\r\n:-2\r\n*2\r\n+admin\r\n+noscript\r\n:0\r\n:0\r\n:0\r\n*6\r\n$7\r\npfcount\r\n:-2\r\n*1\r\n+readonly\r\n:1\r\n:-1\r\n:1\r\n*6\r\n$6\r\nxrange\r\n:-4\r\n*1\r\n+readonly\r\n:1\r\n:1\r\n:1\r\n*6\r\n$7\r\nlatency\r\n:-2\r\n*4\r\n+admin\r\n+noscript\r\n+loading\r\n+stale\r\n:0\r\n:0\r\n:0\r\n*6\r\n$7\r\npublish\r\n:3\r\n*5\r\n+write\r\n+pubsub\r\n+loading\r\n+stale\r\n+fast\r\n:0\r\n:0\r\n:0\r\n*6\r\n$6\r\nincrby\r\n:3\r\n*3\r\n+write\r\n+denyoom\r\n+fast\r\n:1\r\n:1\r\n:1\r\n*6\r\n$14\r\nzremrangebylex\r\n:4\r\n*1\r\n+write\r\n:1\r\n:1\r\n:1\r\n*6\r\n$5\r\nhms')
// push_buf('et\r\n:-4\r\n*3\r\n+write\r\n+denyoom\r\n+fast\r\n:1\r\n:1\r\n:1\r\n')
// push_buf('+OK\r\n')
//
// const parser = new RedisParser({
//     on_reply: data => {
//         if (typeof data === 'string') {
//             console.log('on_reply', JSON.stringify(data))
//         } else {
//             console.log('on_reply', data)
//         }
//     },
//     on_error: data => {
//         console.log(data)
//     },
//     on_fatal: data => {
//         console.log(data)
//     },
// })
//
// // parser.execute(Buffer.concat(buf_arr))
// buf_arr.forEach(buf => {
//     parser.execute(buf)
// })

new Promise(resolve => {
    resolve(1)
}).then(async p => {

    for (let i = 0; i < 10000; i++) {
        client.set('lll', 'lkjlkj +' + i)
        client.get('lll')
    }

    await client.flushdb()
    await client.set('lll', 'lkjlkj')
    await client.get('lll')
    await client.echo('eaioflaefl;kaejgklahefkaej;klahegkljahekfbaejkfbamefbaefr\r\r\n\n\ff\a\efaefaeffealll')
    await client.zadd('a', ['2', 'a', '5', 'b', '6', 'v', '88', 'i'])
    await client.zrange_withscores('a', 0, -1)
    await client.get('lll')
    await client.get('lll')
    await client.quit()
    // console.log(await client.command())
})
